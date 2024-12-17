Component({
  properties: {
    value: {
      type: Number,
      value: 0
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  data: {
    stars: [1, 2, 3, 4, 5]
  },

  methods: {
    handleClick(e) {
      if (this.properties.disabled) return
      const value = e.currentTarget.dataset.value
      this.triggerEvent('change', { value })
    }
  }
}) 