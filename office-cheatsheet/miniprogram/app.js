const data = require('./utils/data');
const storage = require('./utils/storage');
const appConfig = require('./config/app');

App({
  globalData: {
    appName: appConfig.appName,
    appTagline: appConfig.appTagline,
    pendingCategory: '',
    tips: data.allTips,
    categories: data.categories
  },

  onLaunch() {
    storage.ensureStorage();
  }
});

