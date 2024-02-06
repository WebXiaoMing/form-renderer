import {isEmpty, isFunction} from "@/utils";
import { patterns } from "@/utils/validator";

export class Validator {
    constructor(store) {
        this.value = null
        this.label = ''
        this.store = store
        for (const k in patterns) {
            this[k] = message => {
                if (!patterns[k].test(String(this.value))) {
                    return this.error(message, `格式不正确`)
                }
            }
        }
    }

    model(field) {
        this.value = this.store.getValue(field.prop)
        this.label = field.label || ''
        return this
    }

    isEmpty() {
        return isEmpty(this.value)
    }

    error (message, defaultMessage) {
        return new Error(message || `${this.label}${defaultMessage}`)
    }

    validate(ruleName, args) {
        if (ruleName === 'required' && this.isEmpty()) {
            return this.error(args && args[0], '不能为空')
        }
        if (!this.isEmpty() && isFunction(this[ruleName])) {
            return this[ruleName].apply(this, args)
        }
    }

    maxlength(len, message) {
        if (this.value.length > len) {
            return this.error(message, `长度不能超过${len}`)
        }
    }
    minlength(len, message) {
        if (this.value.length < len) {
            return this.error(message, `长度不能小于${len}`)
        }
    }

    max(num, message) {
        if (this.value > num) {
            return this.error(message, `值不能大于${num}`)
        }
    }
    min(num, message) {
        if (this.value < num) {
            return this.error(message, `值不能小于${num}`)
        }
    }
}