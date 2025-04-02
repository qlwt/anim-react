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
    readonly config?: TransValue_New_CSSNumber_Config
}

export const transvalue_new_cssnumber = function <Init, Path>(
    params: TransValue_New_CSSNumber_Params<Init, Path>
): TransValue<TransValue_CSSTarget, Init, Path> {
    const { from, target, config } = params

    return {
        number: {
            init: from,
            path: target,
            effect: css_set => state => {
                config?.tracker?.input(state)

                css_set(`${state}`)
            }
        }
    }
}
