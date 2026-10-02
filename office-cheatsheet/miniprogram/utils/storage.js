const FAVORITES_KEY = 'officeTipsFavorites';
const RECENTS_KEY = 'officeTipsRecents';

function readArray(key) {
  try {
    const value = wx.getStorageSync(key);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function ensureStorage() {
  try {
    if (!Array.isArray(wx.getStorageSync(FAVORITES_KEY))) wx.setStorageSync(FAVORITES_KEY, []);
    if (!Array.isArray(wx.getStorageSync(RECENTS_KEY))) wx.setStorageSync(RECENTS_KEY, []);
  } catch (error) {
    // Storage unavailable should never block the content experience.
  }
}

function getFavorites() {
  return readArray(FAVORITES_KEY);
}

function isFavorite(id) {
  return getFavorites().indexOf(id) > -1;
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index > -1) favorites.splice(index, 1);
  else favorites.unshift(id);
  wx.setStorageSync(FAVORITES_KEY, favorites);
  return index === -1;
}

function getRecents() {
  return readArray(RECENTS_KEY);
}

function addRecent(id, limit) {
  const recents = getRecents().filter((item) => item !== id);
  recents.unshift(id);
  wx.setStorageSync(RECENTS_KEY, recents.slice(0, limit || 8));
}

module.exports = {
  ensureStorage,
  getFavorites,
  isFavorite,
  toggleFavorite,
  getRecents,
  addRecent
};

