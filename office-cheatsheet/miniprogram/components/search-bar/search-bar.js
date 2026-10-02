Component({
  properties: {
    value: { type: String, value: '' },
    placeholder: { type: String, value: '搜索操作' }
  },

  data: { focused: false },

  methods: {
    onInput(event) {
      this.triggerEvent('change', { value: event.detail.value });
    },
    onConfirm(event) {
      this.triggerEvent('confirm', { value: event.detail.value });
    },
    onClear() {
      this.triggerEvent('clear');
    },
    onFocus() {
      this.setData({ focused: true });
    },
    onBlur() {
      this.setData({ focused: false });
    }
  }
});

