import { usePathStyleMap } from "#src/hook/path/stylemap.js"
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type { PathDef_New_StyleMap_Config, PathDef_New_StyleMap_Properties } from "#src/pathdef/new/stylemap.js"
import type { StyleTarget } from "#src/type/StyleTarget.js"
import * as ac from "@qyu/anim-core"
import * as react from "react"

export type AnimStyleMapLine_TransPath = number | {
    readonly target: number
    readonly velocity?: number
}

export type UsePathStyleMapLine_ConfigDefault = {
    readonly velocity: number
}

export type UsePathStyleMapLine_Params = {
    readonly ref: () => StyleTarget | null
    readonly config: InputDef<UsePathStyleMapLine_ConfigDefault>
    readonly properties: InputDef<PathDef_New_StyleMap_Properties<AnimStyleMapLine_TransPath>>
}

type Anim_New_Params = {
    readonly effect: (state: number) => void
    readonly transpath: AnimStyleMapLine_TransPath
    readonly config_default: UsePathStyleMapLine_ConfigDefault
}

const anim_new = function(params: Anim_New_Params): ac.Anim<ac.AnimLine_Point> {
    const { effect, transpath, config_default } = params

    if (typeof transpath === "number") {
        return ac.anim_new_line({
            ...config_default,

            effect,
            target: transpath
        })
    }

    return ac.anim_new_line({
        effect,
        target: transpath.target,
        velocity: transpath.velocity || config_default.velocity
    })
}

export const usePathStyleMapLine = function(params: UsePathStyleMapLine_Params) {
    const { config: config_src } = params

    return usePathStyleMap({
        ref: params.ref,
        properties: params.properties,

        config: react.useMemo(
            () => inputdef_new_pipe(
                config_src,
                (config_default): PathDef_New_StyleMap_Config<ac.AnimLine_Point, AnimStyleMapLine_TransPath> => ({
                    anim_new: (transpath, effect) => anim_new({
                        effect,
                        transpath,
                        config_default
                    })
                })
            ),
            [config_src]
        )
    })
}
