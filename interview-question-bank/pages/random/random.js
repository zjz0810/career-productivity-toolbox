const questions = require('../../data/questions')
const storage = require('../../utils/storage')

function shuffle(list) {
  const result = list.slice()
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1)); const temp = result[i]; result[i] = result[j]; result[j] = temp
  }
  return result
}

Page({
  data: { queue: [], current: null, index: 0, total: 10, answerVisible: false, state: {} },

  onLoad() { this.startRound() },

  startRound() {
    const queue = shuffle(questions).slice(0, Math.min(10, questions.length))
    storage.saveRandomQueue(queue.map(item => item.id))
    this.setData({ queue, current: queue[0], index: 0, total: queue.length, answerVisible: false, state: storage.getState(queue[0].id) })
  },

  revealAnswer() { this.setData({ answerVisible: true }) },

  markResult(event) {
    const result = event.currentTarget.dataset.result; const id = this.data.current.id
    const nextState = result === 'mastered' ? storage.updateState(id, { mastered: true, review: false }) : storage.updateState(id, { mastered: false, review: true })
    this.setData({ state: nextState })
    wx.showToast({ title: result === 'mastered' ? '已记录为会了' : '已加入待复习', icon: 'none' })
    setTimeout(() => this.nextQuestion(), 220)
  },

  nextQuestion() {
    if (this.data.index >= this.data.total - 1) {
      wx.showModal({ title: '本轮完成', content: '这轮题目已经刷完了，要再来一轮吗？', confirmText: '再来一轮', cancelText: '先休息', success: result => { if (result.confirm) this.startRound() } })
      return
    }
    const index = this.data.index + 1; const current = this.data.queue[index]
    this.setData({ index, current, answerVisible: false, state: storage.getState(current.id) })
  },

  openDetail() { wx.navigateTo({ url: `/pages/detail/detail?id=${this.data.current.id}&source=random` }) }
})
