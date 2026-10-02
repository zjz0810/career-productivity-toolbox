(function () {
  'use strict'

  const questions = window.FOC_QUESTIONS || []
  const categories = window.FOC_CATEGORIES || []
  const STATE_KEY = 'foc_question_state_v1'
  const QUEUE_KEY = 'foc_random_queue_v1'
  const app = document.getElementById('app')
  const state = { keyword: '', noteDraft: '', randomQueue: [], randomIndex: 0, toast: '' }
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  history.replaceState(Object.assign({}, history.state || {}, { appRoute: true, scrollY: window.scrollY || 0, depth: 0 }), '', location.href)
  const categoryQuestionNumbers = {}
  const categoryCounters = {}
  questions.forEach(function (item) {
    categoryCounters[item.category] = (categoryCounters[item.category] || 0) + 1
    categoryQuestionNumbers[item.id] = categoryCounters[item.category]
  })

  function readStates() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || '{}') } catch (error) { return {} }
  }

  function getState(id) {
    const all = readStates()
    return Object.assign({ favorite: false, mastered: false, review: false, note: '' }, all[id] || {})
  }

  function updateState(id, patch) {
    const all = readStates()
    all[id] = Object.assign(getState(id), patch)
    localStorage.setItem(STATE_KEY, JSON.stringify(all))
    return all[id]
  }

  function sortMasteredLast(items) {
    const allStates = readStates()
    return items.map(function (item, index) {
      return { item: item, index: index, mastered: allStates[item.id] && allStates[item.id].mastered ? 1 : 0 }
    }).sort(function (a, b) { return a.mastered - b.mastered || a.index - b.index }).map(function (entry) { return entry.item })
  }

  function prepareList(items) {
    return items.map(function (item, index) { return Object.assign({}, item, { displayIndex: categoryQuestionNumbers[item.id] || index + 1 }) })
  }

  function orderedList(items) {
    return sortMasteredLast(prepareList(items))
  }

  function orderedGroupList(items) {
    return sortMasteredLast(items.map(function (item, index) { return Object.assign({}, item, { displayIndex: index + 1 }) }))
  }

  function saveQueue(ids) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(ids))
  }

  function loadQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch (error) { return [] }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;')
  }

  function tagsHtml(tags) {
    return (tags || []).map(function (tag) { return '<span class="tag">' + escapeHtml(tag) + '</span>' }).join('')
  }

  function parseRoute() {
    const raw = location.hash.slice(1) || 'home'
    const parts = raw.split('?')
    return { name: parts[0] || 'home', params: new URLSearchParams(parts[1] || '') }
  }

  function go(name, params) {
    state.answerVisible = false
    const query = new URLSearchParams(params || {}).toString()
    const nextHash = '#' + (query ? name + '?' + query : name)
    const currentRoute = history.state && history.state.appRoute ? history.state : { depth: 0 }
    history.replaceState(Object.assign({}, currentRoute, { appRoute: true, scrollY: window.scrollY || 0 }), '', location.href)
    if (location.hash !== nextHash) history.pushState({ appRoute: true, scrollY: 0, depth: (currentRoute.depth || 0) + 1 }, '', nextHash)
    window.scrollTo(0, 0)
    render()
  }

  function goBack(fallbackName, fallbackParams) {
    if (history.state && history.state.appRoute && history.state.depth > 0) history.back()
    else go(fallbackName, fallbackParams)
  }

  function shuffle(list) {
    const result = list.slice()
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = result[i]
      result[i] = result[j]
      result[j] = temp
    }
    return result
  }

  function getList(source, params) {
    if (source === 'category') return orderedList(questions.filter(function (item) { return item.category === params.get('category') }))
    if (source === 'group') {
      const group = categories.find(function (item) { return item.name === params.get('group') })
      return group ? orderedGroupList(questions.filter(function (item) { return group.children.some(function (child) { return child.name === item.category }) })) : []
    }
    if (source === 'favorite') return orderedList(questions.filter(function (item) { return getState(item.id).favorite }))
    if (source === 'review') return orderedList(questions.filter(function (item) { return getState(item.id).review }))
    if (source === 'mistake') return orderedList(questions.filter(function (item) { return !getState(item.id).mastered }))
    if (source === 'mastered') {
      const category = params.get('category') || ''
      const groupName = params.get('group') || ''
      const group = categories.find(function (item) { return item.name === groupName })
      const scoped = category
        ? orderedList(questions.filter(function (item) { return item.category === category }))
        : (group ? orderedGroupList(questions.filter(function (item) { return group.children.some(function (child) { return child.name === item.category }) })) : [])
      return scoped.filter(function (item) { return getState(item.id).mastered })
    }
    if (source === 'search') {
      const keyword = (params.get('keyword') || '').trim().toLowerCase()
      return orderedList(questions.filter(function (item) {
        return [item.question, item.answer, item.shortAnswer, item.category].concat(item.tags).join(' ').toLowerCase().indexOf(keyword) !== -1
      }))
    }
    if (source === 'random') {
      const queue = state.randomQueue.length ? state.randomQueue : loadQueue()
      const map = {}
      questions.forEach(function (item) { map[item.id] = item })
      return queue.map(function (id) { return map[id] }).filter(Boolean)
    }
    return orderedList(questions)
  }

  function layout(content, active) {
    return '<div class="app-shell">' +
      '<header class="topbar"><button class="brand" data-action="home"><span class="brand-mark">ƒ</span><span><strong>FOC学习题库</strong><small>PMSM · BLDC · 电机控制</small></span></button>' +
      '<nav class="desktop-nav"><button class="' + (active === 'home' ? 'active' : '') + '" data-action="home">题库</button><button class="' + (active === 'search' ? 'active' : '') + '" data-action="search">搜索</button><button class="' + (active === 'random' ? 'active' : '') + '" data-action="random">随机刷题</button></nav></header>' +
      '<main class="main-content">' + content + '</main>' +
      '<nav class="mobile-nav"><button class="' + (active === 'home' ? 'active' : '') + '" data-action="home"><span>⌂</span>题库</button><button class="' + (active === 'search' ? 'active' : '') + '" data-action="search"><span>⌕</span>搜索</button><button class="' + (active === 'random' ? 'active' : '') + '" data-action="random"><span>↻</span>随机</button></nav></div>'
  }

  function questionCard(item, index, source, extra) {
    const params = Object.assign({ id: item.id, source: source || 'all' }, extra || {})
    const attrs = Object.keys(params).map(function (key) { return 'data-' + key + '="' + escapeHtml(params[key]) + '"' }).join(' ')
    const saved = getState(item.id)
    return '<button class="question-card" data-action="detail" ' + attrs + '><span class="question-number">Q' + (item.displayIndex || index + 1) + '</span><span class="question-body"><strong>' + escapeHtml(item.question) + '</strong><span class="card-tags">' + tagsHtml(item.tags) + '</span><span class="card-states">' +
      (saved.favorite ? '<em class="state favorite">已收藏</em>' : '') + (saved.mastered ? '<em class="state mastered">已掌握</em>' : '') + (saved.review ? '<em class="state review">待复习</em>' : '') +
      '<small>难度 ' + escapeHtml(item.difficulty) + '</small></span></span><span class="arrow">›</span></button>'
  }

  function renderHome() {
    const allStates = questions.map(function (item) { return getState(item.id) })
    const mastered = allStates.filter(function (item) { return item.mastered }).length
    const review = allStates.filter(function (item) { return item.review }).length
    const favorite = allStates.filter(function (item) { return item.favorite }).length
    const mistake = allStates.filter(function (item) { return !item.mastered }).length
    const categoryHtml = categories.map(function (category, index) {
      const count = questions.filter(function (item) { return category.children.some(function (child) { return child.name === item.category }) }).length
      return '<button class="category-row" data-action="group" data-group="' + escapeHtml(category.name) + '"><span class="category-index">' + String(index + 1).padStart(2, '0') + '</span><span class="category-copy"><strong>' + escapeHtml(category.name) + '</strong><small>' + escapeHtml(category.description) + '</small><small class="subcategory-count">' + category.children.length + ' 个专题 · ' + count + ' 道题</small></span><span class="category-count">' + count + '<small>题</small></span><span class="arrow">›</span></button>'
    }).join('')
    const preview = orderedList(questions).slice(0, 3).map(function (item, index) { return questionCard(item, index, 'all') }).join('')
    const progress = questions.length ? Math.round(mastered / questions.length * 100) : 0
    return layout('<section class="hero"><div><p class="eyebrow">PERSONAL STUDY NOTES</p><h1>FOC学习题库</h1><p class="subtitle">把问题留下，把答案讲清楚。</p></div><div class="hero-total"><strong>' + questions.length + '</strong><span>道题</span></div></section>' +
      '<button class="search-entry" data-action="search"><span class="search-symbol">⌕</span><span>搜索题目、答案、标签或分类</span><span class="arrow">›</span></button>' +
      '<section class="section-head category-head"><h2>知识大类</h2><span>' + categories.length + ' 个大类</span></section><section class="category-list">' + categoryHtml + '</section>' +
      '<section class="quick-grid"><button class="quick-card blue" data-action="random"><span class="quick-icon">↻</span><strong>随机10题</strong><small>开始一轮练习</small></button><button class="quick-card yellow" data-action="collection" data-mode="favorite"><span class="quick-icon">☆</span><strong>收藏</strong><small>' + favorite + ' 道已收藏</small></button><button class="quick-card orange" data-action="collection" data-mode="review"><span class="quick-icon">◷</span><strong>待复习</strong><small>' + review + ' 道待巩固</small></button><button class="quick-card red" data-action="collection" data-mode="mistake"><span class="quick-icon">!</span><strong>易错题</strong><small>' + mistake + ' 道未掌握</small></button></section>' +
      '<section class="section-head"><h2>学习进度</h2><span>已掌握 ' + mastered + ' / ' + questions.length + '</span></section><div class="progress"><i style="width:' + progress + '%"></i></div>' +
      '<section class="section-head category-head"><h2>题库预览</h2><span>点击进入详情</span></section><section class="question-list">' + preview + '</section>', 'home')
  }

  function renderCategory(params) {
    const mode = params.get('mode') || ''
    const category = params.get('category') || ''
    const group = params.get('group') || ''
    const source = mode || (category ? 'category' : (group ? 'group' : 'all'))
    const titles = { favorite: ['收藏', '值得反复查看的题目'], review: ['待复习', '需要再次巩固的题目'], mistake: ['易错题', '还没有完全掌握的题目'] }
    const groupInfo = categories.find(function (item) { return item.name === group })
    const titleInfo = titles[mode] || [category || group || '题目列表', groupInfo ? groupInfo.description : '按分类持续积累，逐题掌握']
    const list = getList(source, params)
    const extra = category ? { category: category, group: group } : (group ? { group: group } : {})
    function sectionHtml(title, items) {
      const cards = items.map(function (item, index) { return questionCard(item, index, source, extra) }).join('')
      return '<section class="study-section"><div class="study-section-title">' + title + '（' + items.length + '）</div>' + (cards ? '<div class="question-list">' + cards + '</div>' : '<div class="empty section-empty">暂无' + title + '题目</div>') + '</section>'
    }
    const unmastered = list.filter(function (item) { return !getState(item.id).mastered })
    const mastered = list.filter(function (item) { return getState(item.id).mastered })
    const scopedCategory = Boolean(category || group) && !mode
    const cards = scopedCategory
      ? (unmastered.length ? sectionHtml('未掌握', unmastered) : '<section class="study-section"><div class="study-section-title">未掌握（0）</div><div class="empty section-empty">暂无未掌握题目</div></section>') + '<button class="mastered-entry" data-action="mastered" data-category="' + escapeHtml(category) + '" data-group="' + escapeHtml(group) + '">查看已掌握题目（' + mastered.length + '） <span>›</span></button>'
      : (list.length ? list.map(function (item, index) { return questionCard(item, index, source, extra) }).join('') : '<div class="empty">这个列表还没有题目<p>在题目详情中可以收藏或标记待复习。</p></div>')
    const subcategories = groupInfo && !category && !mode ? '<section class="subcategory-list">' + groupInfo.children.map(function (child) { const count = questions.filter(function (item) { return item.category === child.name }).length; return '<button class="subcategory-row" data-action="category" data-category="' + escapeHtml(child.name) + '" data-group="' + escapeHtml(group) + '"><span><strong>' + escapeHtml(child.name) + '</strong><small>' + escapeHtml(child.description) + '</small></span><em>' + count + '题 ›</em></button>' }).join('') + '</section><div class="section-label">本大类全部题目</div>' : ''
    return layout('<div class="page-heading"><button class="back-link" data-action="back-home">‹ 返回题库</button><h1>' + escapeHtml(titleInfo[0]) + '</h1><p>' + escapeHtml(titleInfo[1]) + '</p></div>' + subcategories + (scopedCategory ? '<div class="result-count">总题数：' + list.length + '　未掌握：' + unmastered.length + '　已掌握：' + mastered.length + '</div>' : '<div class="result-count">共 ' + list.length + ' 道题</div>') + cards, 'home')
  }

  function renderMastered(params) {
    const category = params.get('category') || ''
    const group = params.get('group') || ''
    const list = getList('mastered', params)
    const scopeName = category || group || '当前分类'
    const extra = category ? { category: category, group: group } : { group: group }
    const cards = list.map(function (item, index) { return questionCard(item, index, 'mastered', extra) }).join('')
    return layout('<div class="page-heading"><button class="back-link" data-action="back-category" data-category="' + escapeHtml(category) + '" data-group="' + escapeHtml(group) + '">‹ 返回' + escapeHtml(scopeName) + '</button><h1>' + escapeHtml(scopeName) + ' · 已掌握</h1><p>当前分类中已经掌握的题目</p></div><div class="result-count">已掌握 ' + list.length + ' 道题</div>' + (cards ? '<section class="question-list">' + cards + '</section>' : '<div class="empty">暂无已掌握题目<p>在题目详情中标记“已掌握”后，这里会自动更新。</p></div>'), 'home')
  }

  function renderSearch() {
    const keyword = state.keyword.trim()
    const results = keyword ? getList('search', new URLSearchParams({ keyword: keyword })) : []
    const cards = results.map(function (item, index) { return questionCard(item, index, 'search', { keyword: keyword }) }).join('')
    return layout('<div class="page-heading"><h1>搜索</h1><p>支持搜索题目、详细答案、一句话答案、标签和分类</p></div><div class="search-box"><span class="search-symbol">⌕</span><input id="search-input" value="' + escapeHtml(state.keyword) + '" placeholder="搜索关键词，例如 Park、PI、Simulink"><button data-action="clear-search" aria-label="清空">×</button></div>' +
      (keyword ? '<div class="result-count">找到 ' + results.length + ' 道相关题目</div><section class="question-list">' + (cards || '<div class="empty">没有找到相关题目<p>试试更短的关键词，例如 “Park” 或 “PI”。</p></div>') + '</section>' : '<div class="search-guide"><h2>试试这些关键词</h2><div>' + ['FOC', 'Park', 'SVPWM', 'LADRC', 'Simulink'].map(function (tag) { return '<button data-action="keyword" data-keyword="' + tag + '">' + tag + '</button>' }).join('') + '</div></div>'), 'search')
  }

  function renderDetail(params) {
    const source = params.get('source') || 'all'
    const list = getList(source, params)
    const id = params.get('id')
    const index = Math.max(0, list.findIndex(function (item) { return item.id === id }))
    const item = list[index]
    if (!item) return layout('<div class="empty">暂无可显示题目</div>', 'home')
    const saved = getState(item.id)
    const detailParams = { source: source, id: item.id }
    if (params.get('category')) detailParams.category = params.get('category')
    if (params.get('group')) detailParams.group = params.get('group')
    if (params.get('keyword')) detailParams.keyword = params.get('keyword')
    return layout('<div class="detail-top"><button class="back-link" data-action="back" data-source="' + escapeHtml(source) + '" data-category="' + escapeHtml(params.get('category') || '') + '" data-group="' + escapeHtml(params.get('group') || '') + '">‹ 返回列表</button><span>' + (index + 1) + ' / ' + list.length + '</span></div><div class="detail-category">' + escapeHtml(item.category) + ' · Q' + item.displayIndex + '</div><article class="detail-question"><p class="eyebrow">QUESTION</p><h1>' + escapeHtml(item.question) + '</h1><div>' + tagsHtml(item.tags) + '</div></article><button class="show-answer" data-action="toggle-answer">显示答案</button><div id="answer-area" class="answer-area hidden"><article class="answer-block"><h2>容易理解</h2><p class="easy-answer">' + escapeHtml(item.easyAnswer) + '</p></article><article class="answer-block"><h2>一句话回答</h2><p class="short-answer">' + escapeHtml(item.shortAnswer) + '</p></article><article class="answer-block"><h2>详细解释</h2><p>' + escapeHtml(item.answer) + '</p></article></div><section class="state-actions"><button data-action="state" data-type="favorite" class="' + (saved.favorite ? 'selected yellow' : '') + '"><b>' + (saved.favorite ? '★' : '☆') + '</b><span>' + (saved.favorite ? '已收藏' : '收藏') + '</span></button><button data-action="state" data-type="mastered" class="' + (saved.mastered ? 'selected green' : '') + '"><b>✓</b><span>已掌握</span></button><button data-action="state" data-type="review" class="' + (saved.review ? 'selected orange' : '') + '"><b>◷</b><span>' + (saved.review ? '待复习中' : '待复习') + '</span></button></section><section class="note-block"><h2>个人备注</h2><textarea id="note-input" maxlength="500" placeholder="写下自己的理解、疑问或面试表达……">' + escapeHtml(saved.note) + '</textarea><button class="save-note" data-action="save-note" data-id="' + escapeHtml(item.id) + '">保存备注</button></section><div class="detail-nav"><button data-action="navigate-detail" data-step="-1" ' + (index <= 0 ? 'disabled' : '') + '>‹ 上一题</button><button data-action="random-one">随机一题</button><button data-action="navigate-detail" data-step="1" ' + (index >= list.length - 1 ? 'disabled' : '') + '>下一题 ›</button></div>', 'home')
  }

  function ensureRandomRound() {
    if (!state.randomQueue.length) state.randomQueue = loadQueue()
    if (!state.randomQueue.length) {
      state.randomQueue = shuffle(questions).slice(0, Math.min(10, questions.length)).map(function (item) { return item.id })
      state.randomIndex = 0
      saveQueue(state.randomQueue)
    }
    if (state.randomIndex >= state.randomQueue.length) state.randomIndex = 0
  }

  function startRound() {
    state.randomQueue = shuffle(questions).slice(0, Math.min(10, questions.length)).map(function (item) { return item.id })
    state.randomIndex = 0
    saveQueue(state.randomQueue)
    state.toast = ''
  }

  function renderRandom() {
    ensureRandomRound()
    const map = {}; questions.forEach(function (item) { map[item.id] = item })
    const item = map[state.randomQueue[state.randomIndex]]
    const saved = item ? getState(item.id) : {}
    if (!item) return layout('<div class="empty">暂无题目</div>', 'random')
    const answerVisible = state.answerVisible === true
    return layout('<div class="page-heading random-heading"><h1>随机刷题</h1><p>凭记忆回答，再对照答案</p><span class="round-count">' + (state.randomIndex + 1) + ' / ' + state.randomQueue.length + '</span></div><div class="progress"><i style="width:' + ((state.randomIndex + 1) / state.randomQueue.length * 100) + '%"></i></div><article class="practice-card"><div class="detail-category">' + escapeHtml(item.category) + '</div><h1>' + escapeHtml(item.question) + '</h1><div>' + tagsHtml(item.tags) + '</div>' + (answerVisible ? '<div class="practice-answer"><h2>容易理解</h2><p class="easy-answer">' + escapeHtml(item.easyAnswer) + '</p><h2 class="simple-answer-title">一句话回答</h2><p class="short-answer">' + escapeHtml(item.shortAnswer) + '</p><button class="detail-link" data-action="detail" data-id="' + item.id + '" data-source="random">查看详细解释 ›</button></div>' : '<button class="show-answer" data-action="reveal-random">显示答案</button>') + '</article><section class="result-panel"><h2>这道题掌握得怎么样？</h2><div class="result-buttons"><button class="mastered" data-action="random-result" data-result="mastered">会了</button><button class="fuzzy" data-action="random-result" data-result="review">模糊</button><button class="unknown" data-action="random-result" data-result="review">不会</button></div></section><button class="restart" data-action="restart-round">重新生成10题</button>' + (state.toast ? '<p class="toast">' + escapeHtml(state.toast) + '</p>' : ''), 'random')
  }

  function render() {
    const route = parseRoute()
    if (route.name === 'category') app.innerHTML = renderCategory(route.params)
    else if (route.name === 'mastered') app.innerHTML = renderMastered(route.params)
    else if (route.name === 'detail') app.innerHTML = renderDetail(route.params)
    else if (route.name === 'search') app.innerHTML = renderSearch()
    else if (route.name === 'random') app.innerHTML = renderRandom()
    else app.innerHTML = renderHome()
  }

  function detailParamsFromButton(button, id) {
    const params = { id: id, source: button.dataset.source || 'all' }
    if (button.dataset.category) params.category = button.dataset.category
    if (button.dataset.group) params.group = button.dataset.group
    if (button.dataset.keyword) params.keyword = button.dataset.keyword
    return params
  }

  app.addEventListener('click', function (event) {
    const button = event.target.closest('[data-action]')
    if (!button) return
    const action = button.dataset.action
    if (action === 'home') go('home')
    else if (action === 'back-home') goBack('home')
    else if (action === 'search') go('search')
    else if (action === 'random') { startRound(); go('random') }
    else if (action === 'category') go('category', { category: button.dataset.category, group: button.dataset.group || '' })
    else if (action === 'group') go('category', { group: button.dataset.group })
    else if (action === 'collection') go('category', { mode: button.dataset.mode })
    else if (action === 'mastered') go('mastered', { category: button.dataset.category || '', group: button.dataset.group || '' })
    else if (action === 'back-category') goBack('category', { category: button.dataset.category || '', group: button.dataset.group || '' })
    else if (action === 'keyword') { state.keyword = button.dataset.keyword; render() }
    else if (action === 'clear-search') { state.keyword = ''; render() }
    else if (action === 'detail') go('detail', detailParamsFromButton(button, button.dataset.id))
    else if (action === 'toggle-answer') { const area = document.getElementById('answer-area'); area.classList.toggle('hidden'); button.textContent = area.classList.contains('hidden') ? '显示答案' : '收起答案' }
    else if (action === 'reveal-random') { state.answerVisible = true; render() }
    else if (action === 'state') {
      const current = parseRoute().params.get('id'); const oldState = getState(current); const type = button.dataset.type; let patch = {}
      if (type === 'favorite') patch = { favorite: !oldState.favorite }
      if (type === 'mastered') patch = { mastered: !oldState.mastered, review: false }
      if (type === 'review') patch = { review: !oldState.review, mastered: false }
      updateState(current, patch); state.toast = type === 'favorite' ? (getState(current).favorite ? '已收藏' : '已取消收藏') : '状态已保存'; render()
      window.setTimeout(function () { state.toast = ''; render() }, 900)
    } else if (action === 'save-note') {
      const id = button.dataset.id; updateState(id, { note: document.getElementById('note-input').value }); state.toast = '备注已保存'; render()
      window.setTimeout(function () { state.toast = ''; render() }, 900)
    } else if (action === 'navigate-detail') {
      const route = parseRoute(); const list = getList(route.params.get('source') || 'all', route.params); const index = list.findIndex(function (item) { return item.id === route.params.get('id') }); const next = list[index + Number(button.dataset.step)]
      if (next) { const params = detailParamsFromButton(button, next.id); params.source = route.params.get('source') || 'all'; params.category = route.params.get('category') || ''; params.group = route.params.get('group') || ''; params.keyword = route.params.get('keyword') || ''; go('detail', params) }
    } else if (action === 'random-one') {
      const candidates = questions.filter(function (item) { return item.id !== parseRoute().params.get('id') }); const item = candidates[Math.floor(Math.random() * candidates.length)]
      if (item) go('detail', { id: item.id, source: 'all' })
    } else if (action === 'back') {
      if (button.dataset.source === 'category' && button.dataset.category) goBack('category', { category: button.dataset.category })
      else if (button.dataset.source === 'group' && button.dataset.group) goBack('category', { group: button.dataset.group })
      else if (button.dataset.source === 'mastered') goBack('mastered', { category: button.dataset.category || '', group: button.dataset.group || '' })
      else if (['favorite', 'review', 'mistake'].indexOf(button.dataset.source) !== -1) goBack('category', { mode: button.dataset.source })
      else if (button.dataset.source === 'search') goBack('search')
      else if (button.dataset.source === 'random') goBack('random')
      else goBack('home')
    } else if (action === 'restart-round') { startRound(); render() }
    else if (action === 'random-result') {
      const map = {}; questions.forEach(function (item) { map[item.id] = item }); const item = map[state.randomQueue[state.randomIndex]]
      if (!item) return
      if (button.dataset.result === 'mastered') updateState(item.id, { mastered: true, review: false })
      else updateState(item.id, { mastered: false, review: true })
      state.toast = button.dataset.result === 'mastered' ? '已记录为会了' : '已加入待复习'; render()
      window.setTimeout(function () { state.randomIndex += 1; state.answerVisible = false; state.toast = ''; render() }, 280)
    }
  })

  app.addEventListener('input', function (event) {
    if (event.target.id === 'search-input') {
      state.keyword = event.target.value
      render()
      const input = document.getElementById('search-input')
      input.focus(); input.setSelectionRange(input.value.length, input.value.length)
    }
  })

  window.addEventListener('popstate', function (event) {
    const scrollY = event.state && event.state.appRoute ? event.state.scrollY || 0 : 0
    window.scrollTo(0, scrollY)
    render()
    window.scrollTo(0, scrollY)
  })
  render()
})()
