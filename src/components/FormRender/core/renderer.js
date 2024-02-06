
export function createRenderer(options) {
    const {
        buildComponent,
        buildProps,
        buildEvents,
        buildAttrs,
        buildChildren
    } = options

    return function buildRender(field, context) {
        const component = buildComponent(field, context)
        const on = buildEvents(field, context)
        const attrs = buildAttrs(field, context)

        return function render(h, context) {
            const props = buildProps(field, context)
            if (context.$scopedSlots.default) {
                return context.$scopedSlots.default({ field, props, on, attrs })
            }
            return h(component, {
                props,
                on,
                attrs
            }, buildChildren(h, field, context))
        }
    }
}