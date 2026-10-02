const appConfig = require('../../config/app');
const data = require('../../utils/data');
const storage = require('../../utils/storage');

Page({
  data: {
    appName: appConfig.appName,
    appTagline: appConfig.appTagline,
    searchPlaceholder: appConfig.searchPlaceholder,
    query: '',
    categories: data.categories,
    commonTips: [],
    recentTips: [],
    searchResults: []
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: appConfig.appName });
    const commonIds = [
      'word-remove-blank-page', 'word-columns-2', 'word-remove-extra-spaces',
      'excel-freeze-first-row', 'excel-remove-duplicates', 'excel-auto-column-width',
      'word-page-number', 'excel-sum'
    ];
    this.setData({ commonTips: commonIds.map(data.getTipById).filter(Boolean) });
  },

  onShow() {
    this.setData({ recentTips: storage.getRecents().map(data.getTipById).filter(Boolean) });
  },

  onSearchChange(event) {
    const query = event.detail.value;
    this.setData({ query, searchResults: data.searchTips(query) });
  },

  onSearchClear() {
    this.setData({ query: '', searchResults: [] });
  },

  openTip(event) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` });
  },

  openCategory(event) {
    const categoryId = event.currentTarget.dataset.id;
    const app = getApp();
    if (categoryId) app.globalData.pendingCategory = categoryId;
    wx.switchTab({ url: '/pages/category/category' });
  }
});

