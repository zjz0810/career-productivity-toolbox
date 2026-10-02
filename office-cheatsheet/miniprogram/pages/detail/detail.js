const appConfig = require('../../config/app');
const data = require('../../utils/data');
const storage = require('../../utils/storage');

Page({
  data: {
    tip: null,
    favorite: false,
    relatedTips: []
  },

  onLoad(options) {
    wx.setNavigationBarTitle({ title: appConfig.appName });
    const tip = data.getTipById(options.id);
    if (!tip) return;
    storage.addRecent(tip.id, appConfig.recentLimit);
    this.setData({
      tip,
      favorite: storage.isFavorite(tip.id),
      relatedTips: (tip.relatedIds || []).map(data.getTipById).filter(Boolean)
    });
  },

  onShow() {
    if (this.data.tip) this.setData({ favorite: storage.isFavorite(this.data.tip.id) });
  },

  toggleFavorite() {
    if (!this.data.tip) return;
    const active = storage.toggleFavorite(this.data.tip.id);
    this.setData({ favorite: active });
    wx.showToast({ title: active ? '已收藏' : '已取消收藏', icon: 'none' });
  },

  previewImage(event) {
    const index = Number(event.currentTarget.dataset.index);
    const urls = (this.data.tip.images || []).map((item) => typeof item === 'string' ? item : (item.full || item.thumb)).filter(Boolean);
    if (!urls.length) return;
    wx.previewImage({ current: urls[index] || urls[0], urls });
  },

  onImageError(event) {
    const index = Number(event.currentTarget.dataset.index);
    const images = this.data.tip.images.map((item) => typeof item === 'string' ? { thumb: item, full: item } : Object.assign({}, item));
    images[index].failed = true;
    this.setData({ 'tip.images': images });
  },

  openRelated(event) {
    wx.redirectTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` });
  }
});

