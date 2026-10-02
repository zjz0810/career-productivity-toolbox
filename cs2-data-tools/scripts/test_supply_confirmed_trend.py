from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
PRICE_ROOT = ROOT / "data" / "raw" / "knives"
FRICTIONS = (0.0, 0.01, 0.02, 0.03, 0.05)


def load_series(folder: Path, value_col: str) -> dict[int, pd.Series]:
    result: dict[int, pd.Series] = {}
    for path in folder.glob("*.csv"):
        frame = pd.read_csv(path)
        frame["date"] = pd.to_datetime(frame["date"], errors="coerce")
        frame[value_col] = pd.to_numeric(frame[value_col], errors="coerce")
        frame = frame.dropna(subset=["date", value_col]).sort_values("date")
        if frame.empty:
            continue
        good_id = int(frame["good_id"].iloc[0])
        result[good_id] = (
            frame.drop_duplicates("date", keep="last")
            .set_index("date")[value_col]
            .astype(float)
        )
    return result


def value_on_or_before(series: pd.Series, date: pd.Timestamp) -> float | None:
    values = series.loc[:date]
    return None if values.empty else float(values.iloc[-1])


def value_on_or_after(series: pd.Series, date: pd.Timestamp, days: int = 7) -> tuple[pd.Timestamp, float] | None:
    values = series.loc[date : date + pd.Timedelta(days=days)]
    if values.empty:
        return None
    return pd.Timestamp(values.index[0]), float(values.iloc[0])


def trailing_return(series: pd.Series, cutoff: pd.Timestamp, days: int) -> float | None:
    current = value_on_or_before(series, cutoff)
    prior = value_on_or_before(series, cutoff - pd.Timedelta(days=days))
    if current is None or prior is None or prior <= 0:
        return None
    return current / prior - 1


def trailing_percentile(series: pd.Series, cutoff: pd.Timestamp, days: int) -> float | None:
    window = series.loc[cutoff - pd.Timedelta(days=days) : cutoff]
    if len(window) < 60:
        return None
    current = float(window.iloc[-1])
    return float((window <= current).mean())


def metrics_at(
    price: pd.Series, inventory: pd.Series, cutoff: pd.Timestamp
) -> dict[str, float] | None:
    p30 = trailing_return(price, cutoff, 30)
    p90 = trailing_return(price, cutoff, 90)
    pctl180 = trailing_percentile(price, cutoff, 180)
    inv30 = trailing_return(inventory, cutoff, 30)
    inv_pctl180 = trailing_percentile(inventory, cutoff, 180)
    values = (p30, p90, pctl180, inv30, inv_pctl180)
    if any(value is None for value in values):
        return None
    return {
        "price_return_30d": float(p30),
        "price_return_90d": float(p90),
        "price_percentile_180d": float(pctl180),
        "inventory_return_30d": float(inv30),
        "inventory_percentile_180d": float(inv_pctl180),
    }


def summary_row(group: pd.DataFrame, friction: float) -> dict[str, float | int]:
    net = (1 + group["gross_return"]) * (1 - friction) - 1
    return {
        "signals": int(len(group)),
        "average_return": float(net.mean()),
        "median_return": float(net.median()),
        "win_rate": float((net > 0).mean()),
        "worst_return": float(net.min()),
        "best_return": float(net.max()),
    }


def main() -> None:
    prices = {
        "BUFF": load_series(PRICE_ROOT / "buff", "price"),
        "悠悠": load_series(PRICE_ROOT / "yyyp", "price"),
    }
    inventories = {
        "BUFF": load_series(PRICE_ROOT / "buff_sell_num", "sell_num"),
        "悠悠": load_series(PRICE_ROOT / "yyyp_sell_num", "sell_num"),
    }
    common_ids = sorted(
        set(prices["BUFF"])
        & set(prices["悠悠"])
        & set(inventories["BUFF"])
        & set(inventories["悠悠"])
    )

    records: list[dict[str, object]] = []
    decisions = pd.date_range("2023-07-01", "2026-08-01", freq="MS")
    for decision in decisions:
        cutoff = decision - pd.Timedelta(days=1)
        market_returns: dict[str, float] = {}
        for platform in ("BUFF", "悠悠"):
            returns = [
                trailing_return(prices[platform][good_id], cutoff, 30)
                for good_id in common_ids
            ]
            valid_returns = [value for value in returns if value is not None]
            market_returns[platform] = float(np.median(valid_returns)) if valid_returns else np.nan

        market_ok = all(value > 0 for value in market_returns.values())
        if not market_ok:
            continue

        selected: list[tuple[int, dict[str, dict[str, float]]]] = []
        for good_id in common_ids:
            item_metrics: dict[str, dict[str, float]] = {}
            for platform in ("BUFF", "悠悠"):
                metrics = metrics_at(
                    prices[platform][good_id], inventories[platform][good_id], cutoff
                )
                if metrics is None:
                    break
                item_metrics[platform] = metrics
            if len(item_metrics) != 2:
                continue

            qualifies = all(
                metrics["price_return_30d"] > 0
                and metrics["price_return_90d"] > 0
                and metrics["price_percentile_180d"] < 0.80
                and metrics["inventory_return_30d"] < 0
                and metrics["inventory_percentile_180d"] < 0.50
                for metrics in item_metrics.values()
            )
            if qualifies:
                selected.append((good_id, item_metrics))

        for good_id, item_metrics in selected:
            for platform in ("BUFF", "悠悠"):
                buy = value_on_or_after(prices[platform][good_id], decision)
                if buy is None:
                    continue
                buy_date, buy_price = buy
                sell = value_on_or_after(
                    prices[platform][good_id], buy_date + pd.Timedelta(days=30)
                )
                if sell is None:
                    continue
                sell_date, sell_price = sell
                records.append(
                    {
                        "decision_month": decision.strftime("%Y-%m"),
                        "year": int(decision.year),
                        "platform": platform,
                        "good_id": good_id,
                        "buy_date": buy_date.date().isoformat(),
                        "sell_date": sell_date.date().isoformat(),
                        "buy_price": buy_price,
                        "sell_price": sell_price,
                        "gross_return": sell_price / buy_price - 1,
                        "market_return_30d": market_returns[platform],
                        **item_metrics[platform],
                    }
                )

    trades = pd.DataFrame(records)
    if trades.empty:
        print("No trades generated.")
        return

    print(f"universe={len(common_ids)} trade_rows={len(trades)}")
    print("\nPOOLED")
    for platform, group in trades.groupby("platform", sort=True):
        for friction in FRICTIONS:
            print(platform, f"friction={friction:.0%}", summary_row(group, friction))

    print("\nBY_YEAR")
    for (year, platform), group in trades.groupby(["year", "platform"], sort=True):
        for friction in FRICTIONS:
            print(year, platform, f"friction={friction:.0%}", summary_row(group, friction))

    print("\nMONTHLY_PORTFOLIO")
    monthly = (
        trades.groupby(["decision_month", "platform"], as_index=False)["gross_return"]
        .mean()
        .sort_values(["platform", "decision_month"])
    )
    for platform, group in monthly.groupby("platform", sort=True):
        for friction in FRICTIONS:
            net = (1 + group["gross_return"]) * (1 - friction) - 1
            wealth = (1 + net).cumprod()
            drawdown = wealth / wealth.cummax() - 1
            print(
                platform,
                f"friction={friction:.0%}",
                {
                    "months": int(len(group)),
                    "average_month": float(net.mean()),
                    "median_month": float(net.median()),
                    "winning_months": float((net > 0).mean()),
                    "total_return": float(wealth.iloc[-1] - 1),
                    "max_drawdown": float(drawdown.min()),
                },
            )


if __name__ == "__main__":
    main()
