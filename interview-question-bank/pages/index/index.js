const questions = require('../../data/questions')
const categories = require('../../data/categories')
const storage = require('../../utils/storage')

function decorateQuestions() {
  const states = storage.getAllStates()
  return questions.map(item => ({
    ...item,
    state: Object.assign({ favorite: false, mastered: false, review: false }, states[item.id] || {})
  }))
}

Page({
  data: {
    total: 0,
    masteredCount: 0,
    reviewCount: 0,
    favoriteCount: 0,
    mistakeCount: 0,
    categories: [],
    recentQuestions: []
  },

  onShow() { this.refresh() },

  refresh() {
    const list = decorateQuestions()
    const states = list.map(item => item.state)
    this.setData({
      total: questions.length,
      masteredCount: states.filter(item => item.mastered).length,
      reviewCount: states.filter(item => item.review).length,
      favoriteCount: states.filter(item => item.favorite).length,
      mistakeCount: states.filter(item => !item.mastered).length,
      categories: categories.map(category => ({
        ...category,
        count: questions.filter(item => category.children.some(child => child.name === item.category)).length,
        subcategoryCount: category.children.length
      })),
      recentQuestions: storage.sortMasteredLast(list).slice(0, 3)
    })
  },

  goSearch() { wx.switchTab({ url: '/pages/search/search' }) },
  goRandom() { wx.switchTab({ url: '/pages/random/random' }) },

  openCategory(event) {
    const group = event.currentTarget.dataset.group
    wx.navigateTo({ url: `/pages/category/category?group=${encodeURIComponent(group)}` })
  },

  openCollection(event) {
    wx.navigateTo({ url: `/pages/category/category?mode=${event.currentTarget.dataset.mode}` })
  },

  openQuestion(event) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}&source=all` })
  }
})
