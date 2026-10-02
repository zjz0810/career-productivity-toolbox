const APP_CONFIG = {
  appName: '办公技巧',
  appTagline: '遇到具体问题，快速找到点哪里。',
  searchPlaceholder: '搜索操作，例如：删除空格、两栏、冻结首行',
  recentLimit: 8
};

const STORAGE = { favorites: 'officeTipsFavorites', recents: 'officeTipsRecents' };
const state = { tips: [], categories: [], query: '', activeCategory: 'word', activeSubcategory: '', route: null };
const app = document.querySelector('#app');

function readArray(key) {
  try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; }
  catch (error) { return []; }
}
function writeArray(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) {} }
function favorites() { return readArray(STORAGE.favorites); }
function recents() { return readArray(STORAGE.recents); }
function normalize(value) { return String(value || '').trim().toLowerCase().replace(/[\s　]+/g, ''); }
function tipById(id) { return state.tips.find((tip) => tip.id === id); }
function tipsByCategory(category) { return state.tips.filter((tip) => tip.category === category); }
function categoryById(id) { return state.categories.find((category) => category.id === id); }

function searchTips(query, categoryId) {
  const keyword = normalize(query);
  if (!keyword) return [];
  return state.tips
    .filter((tip) => !categoryId || tip.category === categoryId)
    .map((tip) => {
      const title = normalize(tip.title);
      const summary = normalize(tip.summary);
      const keywordText = normalize((tip.keywords || []).join(' '));
      const aliasText = normalize((tip.aliases || []).join(' '));
      let score = 0;
      if (title === keyword) score += 1000;
      else if (title.includes(keyword)) score += 600;
      if ((tip.keywords || []).some((item) => normalize(item) === keyword)) score += 400;
      if (keywordText.includes(keyword)) score += 250;
      if (aliasText.includes(keyword)) score += 150;
      if (summary.includes(keyword)) score += 80;
      return { tip, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.tip);
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
function setRoute(path) { window.location.hash = path.startsWith('#') ? path : `#${path}`; }
function tipList(tips, emptyText = '暂时没找到这个操作') {
  if (!tips.length) return `<div class="empty"><span class="empty-icon">⌕</span><strong>${emptyText}</strong><p>换个关键词试试，例如：空格、页码、两栏</p></div>`;
  return `<div class="list-card">${tips.map((tip) => `
    <button class="list-row" data-route="/detail/${escapeHtml(tip.id)}">
      <span class="list-dot ${tip.category}"></span>
      <span class="list-row-main"><span class="tip-title-line"><span class="list-row-title">${escapeHtml(tip.title)}</span><span class="tag">${escapeHtml(tip.subcategoryName)}</span></span><span class="list-row-summary">${escapeHtml(tip.summary)}</span></span>
      <span class="chevron">›</span>
    </button>`).join('')}</div>`;
}
function sectionHeading(title, meta = '') { return `<div class="section-heading"><h2>${title}</h2>${meta ? `<span>${meta}</span>` : ''}</div>`; }

function renderNav() {
  const route = state.route || { name: 'home' };
  return `<nav class="site-nav">
    <a class="brand" href="#/home"><span class="brand-mark">速</span>${escapeHtml(APP_CONFIG.appName)}</a>
    <div class="nav-links">
      <button class="nav-link ${route.name === 'home' ? 'active' : ''}" data-route="/home">首页</button>
      <button class="nav-link ${route.name === 'category' ? 'active' : ''}" data-route="/category/word">分类</button>
      <button class="nav-link ${route.name === 'favorites' ? 'active' : ''}" data-route="/favorites">收藏 <span class="nav-count">${favorites().length || ''}</span></button>
    </div>
  </nav>`;
}

function searchBox(value = '', placeholder = APP_CONFIG.searchPlaceholder) {
  return `<div class="search-wrap"><label class="search-box"><span class="search-icon">⌕</span><input id="page-search" class="search-input" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" autocomplete="off" /><button id="clear-search" class="clear-search" type="button" aria-label="清除搜索" ${value ? '' : 'hidden'}>×</button></label></div>`;
}

function renderHome() {
  const query = state.query;
  const results = searchTips(query);
  if (query) return `<main class="container"><div class="page-heading"><span class="eyebrow">${escapeHtml(APP_CONFIG.appName)}</span><h1>搜索结果</h1><p>找到 ${results.length} 条和「${escapeHtml(query)}」相关的操作。</p></div>${searchBox(query)}<div class="result-head"><h2>相关操作</h2><span class="result-count">${results.length} 条</span></div>${tipList(results)}</main>`;
  const categoryCards = state.categories.map((category) => `<button class="category-card" data-route="/category/${category.id}"><span class="category-icon ${category.id}">${category.icon}</span><span class="category-copy"><span class="category-name">${category.name}</span><span class="category-desc">${category.description}</span></span><span class="chevron">›</span></button>`).join('');
  const commonIds = ['word-remove-blank-page', 'word-columns-2', 'word-remove-extra-spaces', 'excel-freeze-first-row', 'excel-remove-duplicates', 'excel-auto-column-width', 'word-page-number', 'excel-sum'];
  const common = commonIds.map(tipById).filter(Boolean);
  const recent = recents().map(tipById).filter(Boolean);
  return `<main class="container"><section class="hero"><span class="eyebrow">${escapeHtml(APP_CONFIG.appName)}</span><h1>今天想解决什么问题？</h1><p>${escapeHtml(APP_CONFIG.appTagline)}</p></section>${searchBox()}<section class="section">${sectionHeading('快捷分类')}<div class="category-grid">${categoryCards}</div></section><section class="section">${sectionHeading('常用操作', '快速打开')} ${tipList(common, '')}</section>${recent.length ? `<section class="section">${sectionHeading('最近查看', '本机保存')}${tipList(recent, '')}</section>` : ''}</main>`;
}

function renderCategory(categoryId) {
  state.activeCategory = categoryId || state.activeCategory || 'word';
  const category = categoryById(state.activeCategory) || state.categories[0];
  const query = state.query;
  const results = searchTips(query, category.id);
  const categoryTips = tipsByCategory(category.id);
  const visible = state.activeSubcategory ? categoryTips.filter((tip) => tip.subcategory === state.activeSubcategory) : categoryTips;
  const tabs = state.categories.map((item) => `<button class="category-tab ${item.id === category.id ? 'active' : ''}" data-route="/category/${item.id}"><span class="tab-icon ${item.id}">${item.icon}</span>${item.name}<small>${tipsByCategory(item.id).length}</small></button>`).join('');
  const pills = [{ id: '', name: '全部' }].concat(category.subcategories).map((item) => `<button class="subcategory-pill ${state.activeSubcategory === item.id ? 'active' : ''}" data-subcategory="${item.id}">${item.name}</button>`).join('');
  const body = query ? `<div class="result-head"><h2>${category.name}搜索结果</h2><span class="result-count">${results.length} 条</span></div>${tipList(results)}` : `<div class="section-heading"><h2>${category.name}技巧分类</h2><span>${visible.length} 个操作</span></div><div class="subcategory-scroll">${pills}</div>${tipList(visible, '')}`;
  return `<main class="container"><section class="page-heading"><span class="eyebrow">快速定位</span><h1>按软件找操作</h1><p>先选软件，再按使用场景缩小范围。</p></section>${searchBox(query, `搜索${category.name}，例如：页码、重复项`)}<div class="category-tabs">${tabs}</div>${body}</main>`;
}

function imageHtml(images) {
  if (!images || !images.length) return `<div class="image-placeholder"><span class="image-placeholder-icon">▧</span><span>图示位置已预留</span><small>后续在 JSON 的 images 字段加入 thumb / full 即可显示</small></div>`;
  return images.map((image, index) => { const src = typeof image === 'string' ? image : image.thumb; return `<figure><img class="demo-image" src="${escapeHtml(src)}" data-image-index="${index}" loading="lazy" alt="${escapeHtml(image.caption || '操作演示图')}" /><figcaption class="image-caption">${escapeHtml(image.caption || '')}</figcaption></figure>`; }).join('');
}

function renderDetail(id) {
  const tip = tipById(id);
  if (!tip) return `<main class="container"><div class="empty"><strong>没有找到这个技巧</strong><p>请返回首页重新搜索。</p><button class="primary-button" data-route="/home">回到首页</button></div></main>`;
  const isFavorite = favorites().includes(tip.id);
  const related = (tip.relatedIds || []).map(tipById).filter(Boolean);
  const steps = tip.steps.map((step, index) => `<div class="step"><span class="step-number">${index + 1}</span><p>${escapeHtml(step)}</p></div>`).join('');
  const path = tip.path.map((item, index) => `<span>${escapeHtml(item)}</span>${index < tip.path.length - 1 ? '<span class="path-arrow">›</span>' : ''}`).join('');
  const tips = (tip.tips || []).map((item) => `<p>· ${escapeHtml(item)}</p>`).join('');
  return `<main class="container"><button class="detail-back" data-back="true">‹ 返回</button><section class="detail-head"><span class="tag">${escapeHtml(tip.categoryName)} · ${escapeHtml(tip.subcategoryName)}</span><h1>${escapeHtml(tip.title)}</h1><p>${escapeHtml(tip.summary)}</p><div class="detail-meta">适用：${escapeHtml(tip.version)}</div></section><div class="detail-layout"><article class="content-card"><section class="content-section"><h2 class="content-title"><span class="content-mark">01</span>最快方法</h2>${steps}</section><section class="content-section"><h2 class="content-title"><span class="content-mark">02</span>操作路径</h2><div class="path-box">${path}</div></section><section class="content-section"><h2 class="content-title"><span class="content-mark">03</span>演示图</h2>${imageHtml(tip.images)}</section><section class="content-section"><h2 class="content-title"><span class="content-mark">04</span>容易踩坑</h2><div class="tips-box">${tips}</div></section></article><aside class="detail-aside"><button class="favorite-button ${isFavorite ? 'active' : ''}" data-favorite="${tip.id}"><span class="favorite-star">${isFavorite ? '★' : '☆'}</span>${isFavorite ? '已收藏' : '收藏操作'}</button>${related.length ? `<div class="aside-card"><h3>相关操作</h3>${related.map((item) => `<button class="related-link" data-route="/detail/${item.id}">${escapeHtml(item.title)}</button>`).join('')}</div>` : ''}</aside></div></main>`;
}

function renderFavorites() {
  const tips = favorites().map(tipById).filter(Boolean);
  return `<main class="container"><section class="page-heading"><span class="eyebrow">随手保存</span><h1>我的收藏</h1><p>把经常用到的操作放在这里，离线也能查看。</p></section>${tips.length ? tipList(tips, '') : `<div class="empty"><span class="empty-icon">☆</span><strong>还没有收藏操作</strong><p>打开一个技巧，点击详情页中的收藏按钮，之后可以在这里快速找到。</p><button class="primary-button" data-route="/home">去首页搜索</button></div>`}</main>`;
}

function parseRoute() {
  const parts = (window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean));
  if (!parts.length || parts[0] === 'home') return { name: 'home' };
  if (parts[0] === 'category') return { name: 'category', category: parts[1] || 'word' };
  if (parts[0] === 'detail') return { name: 'detail', id: parts[1] };
  if (parts[0] === 'favorites') return { name: 'favorites' };
  return { name: 'home' };
}

function render() {
  state.route = parseRoute();
  let body = '';
  if (state.route.name === 'home') body = renderHome();
  if (state.route.name === 'category') body = renderCategory(state.route.category);
  if (state.route.name === 'detail') body = renderDetail(state.route.id);
  if (state.route.name === 'favorites') body = renderFavorites();
  app.innerHTML = renderNav() + body;
  bindEvents();
}

let toastTimer;
function showToast(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 1500); }

function bindEvents() {
  document.querySelectorAll('[data-route]').forEach((element) => element.addEventListener('click', () => { state.query = ''; state.activeSubcategory = ''; setRoute(element.dataset.route); }));
  document.querySelector('[data-back]')?.addEventListener('click', () => window.history.length > 1 ? window.history.back() : setRoute('/home'));
  document.querySelectorAll('[data-subcategory]').forEach((element) => element.addEventListener('click', () => { state.activeSubcategory = element.dataset.subcategory; render(); }));
  document.querySelector('[data-favorite]')?.addEventListener('click', (event) => { const id = event.currentTarget.dataset.favorite; const list = favorites(); const index = list.indexOf(id); if (index > -1) list.splice(index, 1); else list.unshift(id); writeArray(STORAGE.favorites, list); showToast(index > -1 ? '已取消收藏' : '已收藏'); render(); });
  const input = document.querySelector('#page-search');
  input?.addEventListener('input', (event) => { state.query = event.target.value; render(); document.querySelector('#page-search')?.focus(); });
  document.querySelector('#clear-search')?.addEventListener('click', () => { state.query = ''; render(); document.querySelector('#page-search')?.focus(); });
  document.querySelectorAll('[data-image-index]').forEach((image) => image.addEventListener('click', () => { const imageData = tipById(state.route.id).images[Number(image.dataset.imageIndex)]; const src = typeof imageData === 'string' ? imageData : (imageData.full || imageData.thumb); document.querySelector('#lightbox-image').src = src; document.querySelector('#lightbox').hidden = false; }));
  document.querySelectorAll('.demo-image').forEach((image) => image.addEventListener('error', () => { image.replaceWith(Object.assign(document.createElement('div'), { className: 'image-fallback', textContent: '演示图暂时无法加载，请按文字步骤操作。' })); }));
}

document.querySelector('#lightbox')?.addEventListener('click', () => { document.querySelector('#lightbox').hidden = true; });
window.addEventListener('hashchange', () => { if (state.route?.name !== 'detail') state.query = ''; render(); });

async function init() {
  try {
    const [configResponse, wordResponse, excelResponse] = await Promise.all([fetch('../miniprogram/config/app.json'), fetch('../miniprogram/data/word.json'), fetch('../miniprogram/data/excel.json')]);
    if (!configResponse.ok || !wordResponse.ok || !excelResponse.ok) throw new Error('data fetch failed');
    Object.assign(APP_CONFIG, await configResponse.json());
    document.title = APP_CONFIG.appName;
    state.tips = (await wordResponse.json()).concat(await excelResponse.json());
    state.categories = [{ id: 'word', name: 'Word', description: '排版、页面、文字与文档处理', icon: 'W', subcategories: [{ id: 'layout', name: '排版' }, { id: 'page', name: '页面' }, { id: 'text', name: '文字' }, { id: 'image', name: '图片' }, { id: 'table', name: '表格' }, { id: 'header-footer', name: '页眉页脚' }, { id: 'toc', name: '目录' }, { id: 'batch', name: '批量处理' }, { id: 'shortcut', name: '快捷键' }] }, { id: 'excel', name: 'Excel', description: '数据处理、公式与表格分析', icon: 'X', subcategories: [{ id: 'data', name: '数据处理' }, { id: 'formula', name: '公式' }, { id: 'format', name: '表格格式' }, { id: 'find', name: '查找与替换' }, { id: 'filter', name: '筛选排序' }, { id: 'chart', name: '图表' }, { id: 'pivot', name: '数据透视' }, { id: 'print', name: '打印' }, { id: 'shortcut', name: '快捷键' }] }];
    render();
  } catch (error) {
    app.innerHTML = `<div class="empty" style="margin: 100px auto; max-width: 620px"><span class="empty-icon">!</span><strong>网页数据加载失败</strong><p>请通过本地 HTTP 服务打开此页面，不要直接双击 index.html。运行方式见项目 README。</p></div>`;
  }
}

init();

