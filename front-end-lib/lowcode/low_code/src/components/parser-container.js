import container from './container'

export default {
  name: 'Container',

  components: {
    container
  },

  render (h, section, children) {
    const _this = this
    // 从上往下
    const _props = {
      props: {
        jsonSchema: section
      }
    }

    // 从下往上
    const _propsOn = {
      on: {
        dragover: _this.handleDragOver,
        drop: _this.handleDrop
      },
      nativeOn: {
        click: () => {
          _this.$emit('pickType', 'container')
        }
      }
    }

    return (
      <container
        { ..._props }
        { ..._propsOn }
      > { children } </container>
    )
  }
}
