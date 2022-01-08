<template>
  <div class="hello">
    <div class="header">
      顶栏
    </div>
    <div class="main-content">
      <el-row>
        <el-col :span="4">
          <!-- 物料堆 -->
          <div class="component-stack block">
            <div class="component-title">
              物料堆
            </div>
            <ul>
              <li v-for="(item, index) in stacks" :key="index"
                class="component-item"
                :draggable="true" @drag="handleDrag(item)"
                >
                {{ item }}
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="16">
          <!-- 主舞台 -->
          <div class="stage block"
            @dragover.prevent @drop="handleDrop"
          >
            <render-engine ref="engine"
              :jsonSchema="currentJson" :addNode="selectedType"
              @pickType="handlePickType"
            ></render-engine>
            <!-- <li v-for="(item, index) in components" :key="index">
              {{ item }}
              <component :is="item" />
            </li> -->
          </div>
        </el-col>
        <el-col :span="4">
          <!-- 配置面板 -->
          <div class="config-panel block">
            <div class="component-title">
              配置面板
              <config-panel :currentPickType="currentPickType"></config-panel>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { components } from '../components'
import engine from '../fragments/renderEngine'
import configPanel from '../fragments/configPanel'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      // 需要加到配置系统中的组件
      stacks: ['CButton', 'CInput', 'Container'],
      components: [],
      // 数据库拿到的协议
      jsonSchema: {
        page: {
          type: 'Container',
          children: [{
            type: 'CButton'
          }, {
            type: 'Container',
            children: [{
              type: 'CInput'
            }, {
              type: 'CButton'
            }]
          }]
        }
      },
      // 当前操作的数组
      currentJson: {},
      // 物料堆中，当前拾取类型
      selectedType: '',
      // 舞台中，当前选中类型
      currentPickType: ''
    }
  },
  methods: {
    // 拾取被配置节点
    handleDrag (item) {
      this.selectedType = item
    },
    // 放手
    handleDrop () {
      const _type = this.selectedType

      this.components.push(_type)
    },
    // 用户点击选中的节点
    handlePickType (type) {
      this.currentPickType = type
    }
  },
  created () {
    this.currentJson = this.jsonSchema
  },
  components: {
    ...components,
    renderEngine: engine,
    configPanel: configPanel
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .block {
    border: 1px solid var(--lightBg);
    height: 100vh;
  }

  .header {
    padding: 10px;
  }

  /* 物料堆 */
  .component-title {
    padding: 10px;
  }
  .component-item {
    border: 1px solid var(--mainLine);
    margin: 2px 5px;
    padding: 10px 0;
    border-radius: 18px;
  }

</style>
