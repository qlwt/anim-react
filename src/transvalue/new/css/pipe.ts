import type { TransValue } from "#src/transvalue/type/TransValue.js";
import type { TransValue_CSSTarget } from "#src/transvalue/type/TransValue_CSSTarget.js";

export type TransValue_New_CSSPipe_Params<Init, Path> = {
    readonly pipe: (value: string) => string
    readonly src: TransValue<TransValue_CSSTarget, Init, Path>
}

type Params<Init, Path> = TransValue_New_CSSPipe_Params<Init, Path>
type TransValueCSS<Init, Path> = TransValue<TransValue_CSSTarget, Init, Path>

export const transvalue_new_csspipe = function <Init, Path>(params: Params<Init, Path>): TransValueCSS<Init, Path> {
    const { src, pipe } = params

    return Object.fromEntries(Object.entries(src).map(([key, transinstance]) => {
        return [
            key,
            {
                ...transinstance,

                effect: target => transinstance.effect(value => {
                    if (typeof value === "string") {
                        target(pipe(value))
                    } else {
                        target(value)
                    }
                })
            }
        ]
    }))
}
