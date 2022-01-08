<script>
import { components } from '../config'

export default {
  name: 'configPanel',
  props: {
    currentPickType: {
      type: String,
      default: 'cButton'
    }
  },
  components: {
    ...components
  },
  methods: {
    renderPanel (h, type) {
      if (!type) return
      const components = this.$options.components

      return (
        components[type].render.call(this, h)
      )
    }
  },
  render (h) {
    // 初始化参数
    const _type = this.currentPickType
    // 渲染面板
    let _panel = this.renderPanel(h, _type)

    return _panel
  }
}
</script>
