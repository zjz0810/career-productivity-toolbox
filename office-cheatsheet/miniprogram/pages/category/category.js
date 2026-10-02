const appConfig = require('../../config/app');
const data = require('../../utils/data');

Page({
  data: {
    query: '',
    categories: [],
    activeCategory: 'word',
    activeCategoryName: 'Word',
    activeSubcategories: [],
    activeSubcategory: '',
    categoryTips: [],
    visibleTips: [],
    searchResults: []
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '分类 · ' + appConfig.appName });
    const categories = data.categories.map((category) => Object.assign({}, category, { count: data.getTipsByCategory(category.id).length }));
    this.setData({ categories });
    this.refreshCategory('word');
  },

  onShow() {
    const app = getApp();
    if (app.globalData.pendingCategory) {
      this.refreshCategory(app.globalData.pendingCategory);
      app.globalData.pendingCategory = '';
    }
  },

  setCategory(categoryId) {
    if (data.categories.some((category) => category.id === categoryId)) this.refreshCategory(categoryId);
  },

  refreshCategory(categoryId) {
    const category = data.categories.find((item) => item.id === categoryId) || data.categories[0];
    const categoryTips = data.getTipsByCategory(category.id);
    this.setData({
      activeCategory: category.id,
      activeCategoryName: category.name,
      activeSubcategories: category.subcategories,
      activeSubcategory: '',
      categoryTips,
      visibleTips: categoryTips,
      searchResults: data.searchTips(this.data.query, category.id)
    });
  },

  chooseCategory(event) {
    this.refreshCategory(event.currentTarget.dataset.id);
  },

  chooseSubcategory(event) {
    const subcategoryId = event.currentTarget.dataset.id;
    this.setData({
      activeSubcategory: subcategoryId,
      visibleTips: data.getTipsBySubcategory(this.data.activeCategory, subcategoryId)
    });
  },

  showAll() {
    this.setData({ activeSubcategory: '', visibleTips: this.data.categoryTips });
  },

  onSearchChange(event) {
    const query = event.detail.value;
    this.setData({ query, searchResults: data.searchTips(query, this.data.activeCategory) });
  },

  onSearchClear() {
    this.setData({ query: '', searchResults: [] });
  },

  openTip(event) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` });
  }
});

