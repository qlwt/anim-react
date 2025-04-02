import type { TransValue, TransValue_Instance } from "#src/transvalue/type/TransValue.js"
import type { TransValue_CSSTarget } from "#src/transvalue/type/TransValue_CSSTarget.js"

export type TransValue_New_CSSTransform_Definition<Init, Path> = {
    readonly [K in FnName]?: TransValue<TransValue_CSSTarget, Init, Path> | string
}

type FnName = (
    | "perspective"
    | "skewX"
    | "skewY"
    | "scaleX"
    | "scaleY"
    | "scaleZ"
    | "rotateX"
    | "rotateY"
    | "rotateZ"
    | "translateX"
    | "translateY"
    | "translateZ"
)

type Definition<Init, Path> = TransValue_New_CSSTransform_Definition<Init, Path>

export const transvalue_new_csstransform = function <Init, Path>(definition: Definition<Init, Path>): TransValue<TransValue_CSSTarget, Init, Path> {
    const fnmap: { -readonly [K in FnName]?: string | null } = {}

    const calc = (): string | null => {
        const result = new Array<string>()

        for (const name of Object.keys(fnmap)) {
            const fnvalue = fnmap[name as FnName]

            if (typeof fnvalue === "string") {
                result.push(`${name}(${fnvalue})`)
            }
        }

        if (result.length === 0) {
            return null
        }

        return result.join(" ")
    }

    const result: { [K: string]: TransValue_Instance } = {}

    for (const name of Object.keys(definition)) {
        const children = definition[name as FnName]

        if (typeof children === "string") {
            fnmap[name as FnName] = children

            continue
        }

        if (children) {
            for (const children_key of Object.keys(children)) {
                const child = children[children_key]!

                result[`${name}_${children_key}`] = {
                    ...child,

                    effect: css_set => {
                        return state => {
                            child.effect(value => fnmap[name as FnName] = value)(state)

                            css_set(calc())
                        }
                    }
                }
            }
        }
    }

    return result
}
