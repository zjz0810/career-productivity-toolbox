const questions = require('../../data/questions')
const storage = require('../../utils/storage')

function matches(item, keyword) {
  const content = [item.question, item.answer, item.shortAnswer, item.category, ...item.tags].join(' ').toLowerCase()
  return content.indexOf(keyword.toLowerCase()) !== -1
}

Page({
  data: { keyword: '', results: [], hasSearched: false },

  onLoad() { this.runSearch('') },

  onInput(event) {
    const keyword = event.detail.value
    this.setData({ keyword }); this.runSearch(keyword)
  },

  clearSearch() { this.setData({ keyword: '' }); this.runSearch('') },

  runSearch(value) {
    const keyword = (value || '').trim(); const states = storage.getAllStates()
    const results = keyword ? storage.sortMasteredLast(questions.filter(item => matches(item, keyword))) : []
    this.setData({
      results: results.map(item => ({ ...item, state: Object.assign({ favorite: false, mastered: false, review: false }, states[item.id] || {}) })),
      hasSearched: Boolean(keyword)
    })
  },

  openQuestion(event) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}&source=search&keyword=${encodeURIComponent(this.data.keyword)}` })
  }
})
