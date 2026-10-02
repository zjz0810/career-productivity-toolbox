const STATE_KEY = 'foc_question_state_v1'
const RANDOM_QUEUE_KEY = 'foc_random_queue_v1'

function getAllStates() {
  return wx.getStorageSync(STATE_KEY) || {}
}

function getState(id) {
  const states = getAllStates()
  return Object.assign({ favorite: false, mastered: false, review: false, note: '' }, states[id] || {})
}

function updateState(id, patch) {
  const states = getAllStates()
  states[id] = Object.assign(getState(id), patch)
  wx.setStorageSync(STATE_KEY, states)
  return states[id]
}

function saveRandomQueue(ids) {
  wx.setStorageSync(RANDOM_QUEUE_KEY, ids)
}

function getRandomQueue() {
  return wx.getStorageSync(RANDOM_QUEUE_KEY) || []
}

function sortMasteredLast(items) {
  const states = getAllStates()
  return items.map((item, index) => ({
    item,
    index,
    mastered: states[item.id] && states[item.id].mastered ? 1 : 0
  })).sort((a, b) => a.mastered - b.mastered || a.index - b.index).map(entry => entry.item)
}

module.exports = { getAllStates, getState, updateState, saveRandomQueue, getRandomQueue, sortMasteredLast }
