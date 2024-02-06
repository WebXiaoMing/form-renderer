<template>
  <el-form ref="form" @submit.native.prevent :model="{}">
    <el-row :gutter="layout.gutter">
      <el-col
          v-for="field in fields"
          :key="field.prop"
          :span="field.colSpan || layout.colSpan"
      >
        <el-form-item
            :prop="field.prop"
            :label="field.label"
            :rules="store.buildValidator(field)"
            :label-width="(field.labelWidth || labelWidth) + 'px'"
        >
            <component class="hello" :is="store.FormControlComponent" :field="field">
              <template v-if="field.slot" #default="scoped">
                <slot :name="field.slot" v-bind="scoped"></slot>
              </template>
            </component>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { createStore } from "@/components/FormRender/createStore";

export default {
  name: "ElFormRender",
  props: {
    fields: {
      type: Array,
      required: true
    },
    layout: {
      type: Object,
      default: () => ({
        gutter: 0,
        colSpan: 24
      })
    },
    labelWidth: {
      type: Number
    },
    loadOptions: {
      type: Function
    }
  },
  data() {
    return {
      store: createStore(this.loadOptions)
    }
  },
  watch: {
    fields() {
      this.store.clear()
    }
  },
  methods: {
    handleBlur() {
      console.log('blur hahah')
    },
    getModel(...keys) {
      return this.store.getValue(...keys)
    },
    setModel(model) {
      return this.store.setValue(model)
    },
    resetModel() {
      this.store.resetValue()
      this.clearValidate()
    },
    validate() {
      return new Promise(resolve => this.$refs.form.validate(resolve))
    },
    validateField(props) {
      return this.$refs.form.validateField(props)
    },
    clearValidate(props) {
      return this.$refs.form.clearValidate(props)
    }
  }
}
</script>

<style scoped>

</style>