param(
  [int]$Port = 8080
)

$projectRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$node = Get-Command node -ErrorAction SilentlyContinue
$python = Get-Command py -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command python -ErrorAction SilentlyContinue }
if (-not $node -and -not $python) {
  Write-Error "Node.js or Python was not found. Please install one of them."
  exit 1
}

$ip = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
  Select-Object -First 1 -ExpandProperty IPAddress
if (-not $ip) {
  $ipCandidates = ipconfig | Select-String -Pattern 'IPv4[^:]*:\s*([0-9.]+)' | ForEach-Object { $_.Matches[0].Groups[1].Value }
  $ip = $ipCandidates | Where-Object { $_ -match '^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)' } | Select-Object -First 1
  if (-not $ip) { $ip = $ipCandidates | Select-Object -First 1 }
}
if (-not $ip) { $ip = "LAN-IP" }

Write-Host ""
Write-Host "FOC Learning Bank browser version started" -ForegroundColor Cyan
Write-Host ("Computer: http://localhost:{0}/web/" -f $Port)
Write-Host ("Phone: http://{0}:{1}/web/" -f $ip, $Port) -ForegroundColor Green
Write-Host "Connect phone and computer to the same Wi-Fi. Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

Push-Location $projectRoot
try {
  if ($node) {
    $serverScript = Join-Path -Path $projectRoot -ChildPath "serve-lan.js"
    & $node.Source $serverScript $Port
  } else {
    & $python.Source -m http.server $Port --bind 0.0.0.0
  }
} finally {
  Pop-Location
}
