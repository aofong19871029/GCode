import cInput from './cInput'
import store from '../store'

export default {
  name: 'CInput',

  components: {
    cInput
  },

  render (h, section, children) {
    const _this = this
    const _propsOn = {
      nativeOn: {
        click: e => {
          e.stopPropagation()
          _this.$emit('pickType', 'cInput')
        }
      },
      on: {
        viewMounted: e => {
          store.dispatch('props/addWhere', {
            id: e._uid,
            where: e.value
          })
        }
      }
    }
    return (
      <cInput
        { ..._propsOn }
      ></cInput>
    )
  }
}
