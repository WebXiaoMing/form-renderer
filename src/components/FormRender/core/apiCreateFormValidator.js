import {isFunction} from "@/utils";
import {Validator} from "@/components/FormRender/core/validator";

function getRulesByValidateStr(str) {
    if (!str) return
    return str.split(';').reduce((acc, v) => {
        let [name, args] = v.split('=')
        if (name) {
            name = name.trim()
        }
        if (args) {
            args = args.split(',').map(a => a.trim())
        }
        if (name) {
            acc.push({
                name,
                args
            })
        }
        return acc
    }, [])
}

export function apiCreateFormValidator(store) {

    const validator = new Validator(store)

    return function buildValidator(field) {
        if (isFunction(field.validator)) {
            return (_, __, callback) => {
                return callback(field.validator(store.getValue(field.prop), validator.model(field)))
            }
        }
        const rules = getRulesByValidateStr(field.validator)
        if (!rules) return
        return (_, __, callback) => {
            for (let i = 0; i < rules.length; i ++) {
                const error = validator.model(field).validate(rules[i].name, rules[i].args)
                if (error) {
                    return callback(error)
                }
            }
            return callback()
        }
    }
}