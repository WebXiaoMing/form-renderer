import { apiCreateFormControl } from "@/components/FormRender/core/apiCreateFormControl";
import {apiCreateFormStore} from "@/components/FormRender/core/apiCreateFormStore";
import {isFunction, isDef } from "@/utils";


const optionComponents = {
    'el-select': (h, opt) => h('el-option', {
        props: { label: opt.label, value: opt.value }
    }),
    'el-radio-group': (h, opt) => h('el-radio', {
        props: { label: opt.value }
    }, opt.label),
    'el-checkbox-group': (h, opt) => h('el-checkbox', {
        props: { label: opt.value }
    }, opt.label)
}

const defaultPlaceholders = {
    'el-input': '请输入',
    'el-select': '请选择'
}

export function createStore(...args) {
    const buildComponent = field => {
        if (isFunction(field.component)) {
            return {
                functional: true,
                render(h, context) {
                    return field.component(h, context)
                }
            }
        }
        return field.component
    }
    const buildProps = (field, componentInstance) => {
        const originProps = field.componentProps || {}
        const props = {
            ...originProps,
            clearable: isDef(originProps.clearable) ? originProps.clearable : true,
            value: componentInstance.modelValue
        }
        if (field.options && field.options.isDynamic) {
            props.loading = componentInstance.loading
        }
        return props
    }
    const buildEvents = (field, componentInstance) => {
        const originEvents = field.componentEvents || {}
        const events = {
            ...originEvents,
            input: value => {
                componentInstance.modelValue = value
                originEvents['input'] && originEvents['input'](value)
            }
        }
        if (field.component === 'el-input' && field.trimSpace !== false) {
            events['blur'] = () => {
                if (typeof componentInstance.modelValue === 'string') {
                    componentInstance.modelValue = componentInstance.modelValue.trim()
                }
            }
        }
        return events
    }
    const buildAttrs = field => {
        const defPlaceholder = defaultPlaceholders[field.component]
        return {
            placeholder: isDef(field.placeholder) ? field.placeholder : defPlaceholder
        }
    }

    const buildOptionComponent = (h, field, opt) => {
        if (isFunction(field.optionComponent)) {
            return field.optionComponent(h, opt)
        }
        const optionComponent = optionComponents[field.component]
        if (optionComponent) {
            return optionComponent(h, opt)
        }
    }

    const buildChildren = (h, field, componentInstance) => {
        if (componentInstance.options && componentInstance.options.length) {
            return componentInstance.options.map(opt => buildOptionComponent(h, field, opt))
        }
    }

    const createFormControl = apiCreateFormControl({
        buildComponent,
        buildProps,
        buildEvents,
        buildAttrs,
        buildChildren
    })

    return apiCreateFormStore(createFormControl).createStore(...args)
}