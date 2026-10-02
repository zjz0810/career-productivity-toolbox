const questions = require('../../data/questions')
const categories = require('../../data/categories')
const storage = require('../../utils/storage')

const categoryQuestionNumbers = {}
const categoryCounters = {}
questions.forEach(item => {
  categoryCounters[item.category] = (categoryCounters[item.category] || 0) + 1
  categoryQuestionNumbers[item.id] = categoryCounters[item.category]
})

Page({
  data: { title: '', subtitle: '', category: '', group: '', list: [], count: 0 },

  onLoad(options) {
    this.category = options.category ? decodeURIComponent(options.category) : ''
    this.group = options.group ? decodeURIComponent(options.group) : ''
    this.refresh()
  },

  onShow() {
    if (this.category || this.group) this.refresh()
  },

  refresh() {
    let scopeName = this.category || this.group
    let scopeQuestions = this.category ? questions.filter(item => item.category === this.category) : []
    if (!this.category && this.group) {
      const groupInfo = categories.find(item => item.name === this.group)
      scopeQuestions = groupInfo ? questions.filter(item => groupInfo.children.some(child => child.name === item.category)) : []
    }
    const numbered = scopeQuestions.map((item, index) => ({
      ...item,
      displayIndex: this.category ? categoryQuestionNumbers[item.id] : index + 1
    }))
    const list = storage.sortMasteredLast(numbered).filter(item => storage.getState(item.id).mastered)
    this.setData({
      title: `${scopeName} · 已掌握`,
      subtitle: '当前分类中已经掌握的题目',
      category: this.category,
      group: this.group,
      list,
      count: list.length
    })
    wx.setNavigationBarTitle({ title: `${scopeName} · 已掌握` })
  },

  openQuestion(event) {
    const id = event.currentTarget.dataset.id
    const category = this.category ? `&category=${encodeURIComponent(this.category)}` : ''
    const group = this.group ? `&group=${encodeURIComponent(this.group)}` : ''
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}&source=mastered${category}${group}` })
  }
})
