
import { createRenderer } from './renderer'
import {isDef, isFunction} from "@/utils";
export function apiCreateFormControl(options) {
    const buildRender = createRenderer(options)

    return function createFormControl(store) {
        return {
            name: 'FormControl',
            props: {
                field: {
                    type: Object,
                    required: true
                }
            },
            data() {
                return {
                    modelValue: null,
                    loading: false,
                    options: [],
                    originRender: () => {}
                }
            },
            computed: {
                value() {
                    return this.modelValue
                }
            },
            watch: {
                field: {
                    immediate: true,
                    handler(newField) {
                        this.buildOriginRender(newField)
                    }
                }
            },
            render(h) {
                return this.originRender(h, this)
            },
            methods: {
                buildOriginRender(field) {
                    store.register(field.prop, this)
                    this.modelValue = isDef(this.modelValue) ? this.modelValue : (this.field.defaultValue || null)
                    this.loadOptions()
                    this.originRender = buildRender(field, this)
                },
                async loadOptions() {
                    const options = this.field.options
                    if (!options) return
                    if (Array.isArray(this.field.options)) {
                        this.options = Object.freeze(options)
                    } else {
                        if (options.isDynamic) {
                            this.loading = true
                            this.options = []
                            try {
                                const res = await store.loadOptions(this.field)
                                this.options = Object.freeze(res)
                            } catch (e) {
                                console.error(e)
                            } finally {
                                this.loading = false
                            }
                        }
                    }
                },
                getValue() {
                    if (isFunction(this.field.getValue)) {
                        this.field.getValue(this.modelValue)
                    }
                    return this.modelValue
                },
                setValue(newVal) {
                    this.modelValue = isFunction(this.field.setValue) ? this.field.setValue(newVal) : newVal
                },
                resetValue() {
                    this.modelValue = this.field.defaultValue || null
                }
            }
        }
    }
}
