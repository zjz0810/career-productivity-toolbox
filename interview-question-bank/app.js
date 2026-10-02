if (typeof App === 'function') {
  App({
    globalData: {
      appName: 'FOC学习题库'
    },

    onLaunch() {
      const logs = wx.getStorageSync('foc_launch_logs') || []
      logs.unshift(new Date().toISOString())
      wx.setStorageSync('foc_launch_logs', logs.slice(0, 10))
    }
  })
} else if (typeof document !== 'undefined') {
  // 某些本地预览器会自动执行根目录 app.js；浏览器模式需要转交给 web/app.js。
  const startBrowserApp = () => {
    if (!document.getElementById('app') || document.querySelector('script[data-browser-app]')) return
    const browserApp = document.createElement('script')
    browserApp.dataset.browserApp = 'true'
    browserApp.src = '/web/app.js?v=5'
    document.body.appendChild(browserApp)
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startBrowserApp)
  else startBrowserApp()
}
