<template>
  <el-input></el-input>
</template>

<script>
// 默认输入组件
export default {
  name: 'cInput',
  data () {
    return {
      value: '123'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$emit('viewMounted', this)
    })
  }
}
</script>
