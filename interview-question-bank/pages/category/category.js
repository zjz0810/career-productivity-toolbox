const questions = require('../../data/questions')
const categories = require('../../data/categories')
const storage = require('../../utils/storage')
const categoryQuestionNumbers = {}
const categoryCounters = {}
questions.forEach(item => {
  categoryCounters[item.category] = (categoryCounters[item.category] || 0) + 1
  categoryQuestionNumbers[item.id] = categoryCounters[item.category]
})

function withState(items) {
  const states = storage.getAllStates()
  return items.map(item => ({
    ...item,
    state: Object.assign({ favorite: false, mastered: false, review: false }, states[item.id] || {})
  }))
}

Page({
  data: { title: '', subtitle: '', list: [], visibleQuestions: [], unmasteredQuestions: [], masteredQuestions: [], totalCount: 0, masteredCount: 0, showMasteredButton: false, subcategories: [], emptyText: '这个列表还没有题目' },

  onLoad(options) {
    this.mode = options.mode || ''
    this.category = options.category ? decodeURIComponent(options.category) : ''
    this.group = options.group ? decodeURIComponent(options.group) : ''
    this.refresh()
  },

  onShow() {
    if (this.category || this.mode || this.group) this.refresh()
  },

  refresh() {
    let title = this.category || '题目列表'
    let subtitle = '按分类持续积累，逐题掌握'
    let list = questions
    let subcategories = []
    if (this.mode === 'favorite') { title = '收藏'; subtitle = '值得反复查看的题目'; list = questions.filter(item => storage.getState(item.id).favorite) }
    else if (this.mode === 'review') { title = '待复习'; subtitle = '需要再次巩固的题目'; list = questions.filter(item => storage.getState(item.id).review) }
    else if (this.mode === 'mistake') { title = '易错题'; subtitle = '还没有完全掌握的题目'; list = questions.filter(item => !storage.getState(item.id).mastered) }
    else if (this.category) list = questions.filter(item => item.category === this.category)
    else if (this.group) {
      const groupInfo = categories.find(item => item.name === this.group)
      if (groupInfo) {
        title = groupInfo.name
        subtitle = groupInfo.description
        subcategories = groupInfo.children.map(child => ({
          ...child,
          count: questions.filter(item => item.category === child.name).length
        }))
        list = questions.filter(item => groupInfo.children.some(child => child.name === item.category))
      }
    }
    const showMasteredButton = !this.mode && Boolean(this.category || this.group)
    const numberedList = list.map((item, index) => ({ ...item, displayIndex: this.group && !this.category ? index + 1 : (categoryQuestionNumbers[item.id] || index + 1) }))
    const decoratedList = withState(storage.sortMasteredLast(numberedList))
    const unmasteredQuestions = decoratedList.filter(item => !item.state.mastered)
    const masteredQuestions = decoratedList.filter(item => item.state.mastered)
    this.setData({
      title,
      subtitle,
      list: decoratedList,
      visibleQuestions: showMasteredButton ? unmasteredQuestions : decoratedList,
      unmasteredQuestions,
      masteredQuestions,
      totalCount: decoratedList.length,
      masteredCount: masteredQuestions.length,
      showMasteredButton,
      subcategories,
      emptyText: this.mode === 'favorite' ? '还没有收藏题目' : '这个列表还没有题目'
    })
    wx.setNavigationBarTitle({ title })
  },

  openQuestion(event) {
    const id = event.currentTarget.dataset.id
    const source = this.mode || (this.category ? 'category' : (this.group ? 'group' : 'all'))
    const category = this.category ? `&category=${encodeURIComponent(this.category)}` : ''
    const group = this.group ? `&group=${encodeURIComponent(this.group)}` : ''
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}&source=${source}${category}${group}` })
  },

  openSubcategory(event) {
    const category = event.currentTarget.dataset.category
    wx.navigateTo({ url: `/pages/category/category?category=${encodeURIComponent(category)}&group=${encodeURIComponent(this.group)}` })
  },

  openMastered() {
    if (!this.category && !this.group) return
    const category = this.category ? `category=${encodeURIComponent(this.category)}` : `group=${encodeURIComponent(this.group)}`
    wx.navigateTo({ url: `/pages/mastered/mastered?${category}` })
  }
})
