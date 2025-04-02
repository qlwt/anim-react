import type { TransValue } from "#src/transvalue/type/TransValue.js";
import type { TransValue_CSSTarget } from "#src/transvalue/type/TransValue_CSSTarget.js";

type Tracker = {
    readonly input: (message: number) => void
}

export type TransValue_New_CSSColor_Config = {
    readonly tracker?: Tracker
}

export type TransValue_New_CSSColor_Definition<Init, Path> = readonly [
    r: readonly [init: Init, path: Path, config?: TransValue_New_CSSColor_Config] | number,
    g: readonly [init: Init, path: Path, config?: TransValue_New_CSSColor_Config] | number,
    b: readonly [init: Init, path: Path, config?: TransValue_New_CSSColor_Config] | number,
    a?: readonly [init: Init, path: Path, config?: TransValue_New_CSSColor_Config] | number
]

type Definition<Init, Path> = TransValue_New_CSSColor_Definition<Init, Path>

const names = ["red", "green", "blue", "alpha"] as const

const bound = function(value: number | null): number | null {
    if (typeof value === "number") {
        return Math.max(Math.min(255, value), 0)
    }

    return value
}

const bound_alpha = function(value: number | null): number | null {
    if (typeof value === "number") {
        return Math.max(Math.min(1, value), 0)
    }

    return value
}

export const transvalue_new_csscolor = function <Init, Path>(definition: Definition<Init, Path>): TransValue<TransValue_CSSTarget, Init, Path> {
    const transvalue: TransValue<TransValue_CSSTarget, Init, Path> = {}
    const value: [number | null, number | null, number | null, a: number | null] = [null, null, null, null]

    for (let i = 0; i < definition.length; ++i) {
        const name = names[i]!
        const def = definition[i]!

        if (typeof def === "number") {
            value[i] = def

            continue
        }

        transvalue[name] = {
            init: def[0],
            path: def[1],

            effect: target => state => {
                value[i] = state
                def[2]?.tracker?.input(state)

                if (value[3] === null) {
                    target(`rgb(${bound(value[0])}, ${bound(value[1])}, ${bound(value[2])})`)
                } else {
                    target(`rgba(${bound(value[0])}, ${bound(value[1])}, ${bound(value[2])}, ${bound_alpha(value[3])})`)
                }
            }
        }
    }

    return transvalue
}
