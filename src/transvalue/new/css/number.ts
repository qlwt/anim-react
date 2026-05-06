import type { TransValue } from "#src/transvalue/type/TransValue.js";
import type { TransValue_CSSTarget } from "#src/transvalue/type/TransValue_CSSTarget.js";

type Tracker = {
    readonly input: (message: number) => void
}

export type TransValue_New_CSSNumber_Config = {
    readonly tracker?: Tracker
}

export type TransValue_New_CSSNumber_Params<Init, Path> = {
    readonly from: Init
    readonly target: Path
    readonly deps?: null | readonly unknown[]
    readonly config?: TransValue_New_CSSNumber_Config
}

const defaults_deps: readonly unknown[] = []

export const transvalue_new_cssnumber = function <Init, Path>(
    params: TransValue_New_CSSNumber_Params<Init, Path>
): TransValue<TransValue_CSSTarget, Init, Path> {
    const { from, target, config, deps } = params

    return {
        number: {
            deps: deps === undefined ? defaults_deps : deps,
            init: from,
            path: target,
            effect: css_set => state => {
                config?.tracker?.input(state)

                css_set(`${state}`)
            }
        }
    }
}
