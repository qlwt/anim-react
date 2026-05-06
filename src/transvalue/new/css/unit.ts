import type { TransValue } from "#src/transvalue/type/TransValue.js";
import type { TransValue_CSSTarget } from "#src/transvalue/type/TransValue_CSSTarget.js";

type Tracker = {
    readonly input: (message: number) => void
}

export type TransValue_New_CSSUnit_Config = {
    readonly tracker?: Tracker
}

export type TransValue_New_CSSUnit_Params<Init, Path> = {
    readonly unit: string
    readonly from: Init
    readonly target: Path
    readonly deps?: null | readonly unknown[]
    readonly config?: TransValue_New_CSSUnit_Config
}

const defaults_deps: readonly unknown[] = []

export const transvalue_new_cssunit = function <Init, Path>(
    params: TransValue_New_CSSUnit_Params<Init, Path>
): TransValue<TransValue_CSSTarget, Init, Path> {
    const { from, target, unit, config, deps, } = params

    return {
        unit: {
            init: from,
            path: target,
            deps: deps === undefined ? defaults_deps : deps,

            effect: css_set => state => {
                config?.tracker?.input(state)

                css_set(`${state}${unit}`)
            }
        }
    }
}
