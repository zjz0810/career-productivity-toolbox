const appConfig = require('../../config/app');
const data = require('../../utils/data');
const storage = require('../../utils/storage');

Page({
  data: { favoriteTips: [] },

  onLoad() {
    wx.setNavigationBarTitle({ title: '收藏 · ' + appConfig.appName });
  },

  onShow() {
    this.setData({ favoriteTips: storage.getFavorites().map(data.getTipById).filter(Boolean) });
  },

  openTip(event) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` });
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});

