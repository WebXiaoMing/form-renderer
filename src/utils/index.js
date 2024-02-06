
export const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key)

export const isFunction = (value) => typeof value === 'function'

export const isDef = val => val !== undefined && val !== null

const objToString = Object.prototype.toString
export const toTypeString = val => objToString.call(val)

export const isEmpty = value => {
    if (!isDef(value)) {
        return true
    }
    const tag = toTypeString(value)

    if (tag === '[object String]' || tag === '[object Array]') {
        return !value.length
    }
    if (tag === '[object Set]' || tag === '[object Map]') {
        return !value.size
    }
    if (tag === '[object Object]') {
        for (const key in value) {
            if (hasOwn(value, key)) return false
        }
    }
    return true
}