<template>
  <div id="app">
    <FormRender ref="formRender" :fields="fields" :load-options="loadOptions"></FormRender>
    <el-button @click="handleSubmit">提交</el-button>
    <el-button @click="handleReset">重置</el-button>
  </div>
</template>

<script>
import FormRender from "@/components/FormRender";
export default {
  name: 'App',
  components: {
    FormRender
  },
  data() {
    return {
      fields: [
        {
          prop: 'name',
          label: '姓名',
          labelWidth: 200,
          component: 'el-input',
          validator: `required;numeric=请输入数字`
        },
        {
          prop: 'age',
          component: 'el-checkbox'
        }
      ]
    }
  },
  methods: {
    loadOptions(field) {
      console.log(field)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            { value: 'hahah', label: '123' }
          ])
        }, 3000)
      })
    },
    async handleSubmit() {
      const valid = await this.$refs.formRender.validate()
      if (valid) {
        console.log(this.$refs.formRender.getModel())
      }
      console.log(valid)
    },
    handleReset() {
      this.$refs.formRender.resetModel()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
