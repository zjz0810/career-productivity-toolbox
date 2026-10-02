const questions = require('../../data/questions')
const storage = require('../../utils/storage')
const categoryQuestionNumbers = {}
const categoryCounters = {}
questions.forEach(item => {
  categoryCounters[item.category] = (categoryCounters[item.category] || 0) + 1
  categoryQuestionNumbers[item.id] = categoryCounters[item.category]
})

function orderedList(items) {
  const numbered = items.map((item, index) => ({ ...item, displayIndex: categoryQuestionNumbers[item.id] || index + 1 }))
  return storage.sortMasteredLast(numbered)
}

function orderedGroupList(items) {
  const numbered = items.map((item, index) => ({ ...item, displayIndex: index + 1 }))
  return storage.sortMasteredLast(numbered)
}

function searchList(keyword) {
  const value = (keyword || '').trim().toLowerCase()
  if (!value) return orderedList(questions)
  return orderedList(questions.filter(item => [item.question, item.answer, item.shortAnswer, item.category, ...item.tags].join(' ').toLowerCase().indexOf(value) !== -1))
}

Page({
  data: { question: null, state: {}, answerVisible: false, hasPrevious: false, hasNext: false, positionText: '' },

  onLoad(options) {
    this.source = options.source || 'all'
    this.category = options.category ? decodeURIComponent(options.category) : ''
    this.group = options.group ? decodeURIComponent(options.group) : ''
    this.keyword = options.keyword ? decodeURIComponent(options.keyword) : ''
    this.currentId = options.id
    this.loadQuestion()
  },

  getList() {
    if (this.source === 'category' && this.category) return orderedList(questions.filter(item => item.category === this.category))
    if (this.source === 'group' && this.group) {
      const categories = require('../../data/categories')
      const groupInfo = categories.find(item => item.name === this.group)
      return groupInfo ? orderedGroupList(questions.filter(item => groupInfo.children.some(child => child.name === item.category))) : []
    }
    if (this.source === 'favorite') return orderedList(questions.filter(item => storage.getState(item.id).favorite))
    if (this.source === 'review') return orderedList(questions.filter(item => storage.getState(item.id).review))
    if (this.source === 'mistake') return orderedList(questions.filter(item => !storage.getState(item.id).mastered))
    if (this.source === 'mastered') {
      const scoped = this.category
        ? orderedList(questions.filter(item => item.category === this.category))
        : (() => {
            const categories = require('../../data/categories')
            const groupInfo = categories.find(item => item.name === this.group)
            return groupInfo ? orderedGroupList(questions.filter(item => groupInfo.children.some(child => child.name === item.category))) : []
          })()
      return scoped.filter(item => storage.getState(item.id).mastered)
    }
    if (this.source === 'search') return searchList(this.keyword)
    if (this.source === 'random') {
      const ids = storage.getRandomQueue(); const map = {}; questions.forEach(item => { map[item.id] = item })
      return ids.map(id => map[id]).filter(Boolean)
    }
    return orderedList(questions)
  },

  loadQuestion() {
    const list = this.getList(); let index = list.findIndex(item => item.id === this.currentId)
    if (index < 0) index = 0
    const question = list[index]
    if (!question) { this.setData({ question: null, positionText: '暂无可显示题目' }); return }
    this.currentId = question.id; this.currentIndex = index
    this.setData({ question, state: storage.getState(question.id), answerVisible: false, hasPrevious: index > 0, hasNext: index < list.length - 1, positionText: `${index + 1} / ${list.length}` })
  },

  toggleAnswer() { this.setData({ answerVisible: !this.data.answerVisible }) },

  updateQuestionState(event) {
    const type = event.currentTarget.dataset.type; const oldState = this.data.state; let patch = {}
    if (type === 'favorite') patch = { favorite: !oldState.favorite }
    if (type === 'mastered') patch = { mastered: !oldState.mastered, review: false }
    if (type === 'review') patch = { review: !oldState.review, mastered: false }
    const nextState = storage.updateState(this.currentId, patch); const answerVisible = this.data.answerVisible; this.loadQuestion(); this.setData({ state: nextState, answerVisible })
    wx.showToast({ title: type === 'favorite' ? (nextState.favorite ? '已收藏' : '已取消收藏') : '状态已保存', icon: 'none' })
  },

  noteInput(event) { this.noteDraft = event.detail.value },

  saveNote() {
    const note = this.noteDraft === undefined ? (this.data.state.note || '') : this.noteDraft
    const nextState = storage.updateState(this.currentId, { note }); this.setData({ state: nextState })
    wx.showToast({ title: '备注已保存', icon: 'none' })
  },

  navigateQuestion(step) {
    const list = this.getList(); const nextIndex = this.currentIndex + step
    if (nextIndex < 0 || nextIndex >= list.length) return
    this.currentId = list[nextIndex].id; this.loadQuestion(); wx.pageScrollTo({ scrollTop: 0, duration: 0 })
  },

  previousQuestion() { this.navigateQuestion(-1) },
  nextQuestion() { this.navigateQuestion(1) },

  randomQuestion() {
    const candidates = questions.filter(item => item.id !== this.currentId); const picked = candidates[Math.floor(Math.random() * candidates.length)]
    if (!picked) return
    this.source = 'all'; this.category = ''; this.currentId = picked.id; this.loadQuestion(); wx.pageScrollTo({ scrollTop: 0, duration: 0 })
  }
})
