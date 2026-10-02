const word = require('../data/word.json');
const excel = require('../data/excel.json');

const allTips = word.concat(excel);

const categories = [
  {
    id: 'word',
    name: 'Word',
    description: '排版、页面、文字与文档处理',
    icon: 'W',
    color: '#2C6BED',
    subcategories: [
      { id: 'layout', name: '排版' },
      { id: 'page', name: '页面' },
      { id: 'text', name: '文字' },
      { id: 'image', name: '图片' },
      { id: 'table', name: '表格' },
      { id: 'header-footer', name: '页眉页脚' },
      { id: 'toc', name: '目录' },
      { id: 'batch', name: '批量处理' },
      { id: 'shortcut', name: '快捷键' }
    ]
  },
  {
    id: 'excel',
    name: 'Excel',
    description: '数据处理、公式与表格分析',
    icon: 'X',
    color: '#19A974',
    subcategories: [
      { id: 'data', name: '数据处理' },
      { id: 'formula', name: '公式' },
      { id: 'format', name: '表格格式' },
      { id: 'find', name: '查找与替换' },
      { id: 'filter', name: '筛选排序' },
      { id: 'chart', name: '图表' },
      { id: 'pivot', name: '数据透视' },
      { id: 'print', name: '打印' },
      { id: 'shortcut', name: '快捷键' }
    ]
  }
];

function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/[\s　]+/g, '');
}

function getTipById(id) {
  return allTips.find((tip) => tip.id === id);
}

function getTipsByCategory(categoryId) {
  return allTips.filter((tip) => tip.category === categoryId);
}

function getTipsBySubcategory(categoryId, subcategoryId) {
  return getTipsByCategory(categoryId).filter((tip) => tip.subcategory === subcategoryId);
}

function searchTips(query, categoryId) {
  const keyword = normalize(query);
  if (!keyword) return [];

  return allTips
    .filter((tip) => !categoryId || tip.category === categoryId)
    .map((tip) => {
      const title = normalize(tip.title);
      const summary = normalize(tip.summary);
      const keywords = tip.keywords || [];
      const aliases = tip.aliases || [];
      const keywordText = normalize(keywords.join(' '));
      const aliasText = normalize(aliases.join(' '));
      let score = 0;
      if (title === keyword) score += 1000;
      else if (title.indexOf(keyword) > -1) score += 600;
      if (keywords.some((item) => normalize(item) === keyword)) score += 400;
      if (keywordText.indexOf(keyword) > -1) score += 250;
      if (aliasText.indexOf(keyword) > -1) score += 150;
      if (summary.indexOf(keyword) > -1) score += 80;
      return { tip, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.tip);
}

module.exports = {
  allTips,
  categories,
  normalize,
  getTipById,
  getTipsByCategory,
  getTipsBySubcategory,
  searchTips
};

