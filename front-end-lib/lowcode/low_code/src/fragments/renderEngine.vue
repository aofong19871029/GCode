<script>
import { components, parsers } from '../components'
export default {
  name: 'renderEngine',
  props: {
    // 配置协议
    jsonSchema: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 新增拖入舞台的节点
    addNode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      page: undefined
    }
  },
  methods: {
    init () {
      // 提取页面参数（单次初始化）
      this.page = this.jsonSchema.page || {}
    },
    // 渲染根节点
    renderRoot (h) {
      let _page = this.page

      // TODO: 后期丰富全局配置逻辑入口
      return (
        <div class="root">
          { this.renderComponents(h, _page) }
        </div>
      )
    },

    // 渲染组件
    renderComponents (h, section) {
      // 组件通用逻辑在此处理
      // 是否有子节点
      let _children = null

      if (section.children) {
        // 层级渲染
        _children = this.renderChildren(h, section)
      }
      return this.startRender(h, section, _children)
    },

    // 遍历包含兄弟&子节点
    renderChildren (h, section) {
      let _nodeArray = section.children || [].concat(section)
      // 后期可以在此拓展兄弟节点之间通信
      return _nodeArray.map((n, i) => this.renderComponents(h, n, i))
    },

    // 开始渲染
    startRender (h, section, _children) {
      const _type = section.type
      const renderMod = parsers[_type]

      // 直接渲染
      if (renderMod) {
        return renderMod.render.call(this, h, section, _children)
      }
      return null
    },

    // 以下为配置系统统一化处理逻辑
    // 拖拽组件经过触发
    handleDragOver () {
    },
    // 拖拽组件松手
    handleDrop (event, vm) {
      const _json = vm.jsonSchema

      if (_json && _json.type === 'Container') {
        if (!_json.children) {
          this.$set(_json, 'children', [])
        }
        _json.children.push({
          type: this.addNode
        })
      }
    }
  },
  components: {
    ...components,
    ...parsers
  },
  created () {
    this.init()
  },
  render (h) {
    let _vode = this.renderRoot(h)

    return _vode
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .block {
    border: 1px solid var(--lightBg);
    height: 100vh;
  }
</style>
