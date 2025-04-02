import { usePathStyleMap } from "#src/hook/path/stylemap.js"
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type { PathDef_New_StyleMap_Config, PathDef_New_StyleMap_Properties } from "#src/pathdef/new/stylemap.js"
import type { StyleTarget } from "#src/type/StyleTarget.js"
import * as ac from "@qyu/anim-core"
import * as react from "react"

export type AnimStyleMapSpring_TransPath = number | {
    readonly target: number
    readonly natfreq?: number
    readonly dampratio?: number
    readonly precision?: ac.AnimNewSpring_Config["precision"]
}

export type UsePathStyleMapSpring_ConfigDefault = {
    readonly natfreq: number
    readonly dampratio: number

    readonly precision?: ac.AnimNewSpring_Config["precision"]
}

export type UsePathStyleMapSpring_Params = {
    readonly ref: () => StyleTarget | null
    readonly config: InputDef<UsePathStyleMapSpring_ConfigDefault>
    readonly properties: InputDef<PathDef_New_StyleMap_Properties<AnimStyleMapSpring_TransPath>>
}

type Anim_New_Params = {
    readonly effect: (state: number) => void
    readonly transpath: AnimStyleMapSpring_TransPath
    readonly config_default: UsePathStyleMapSpring_ConfigDefault
}

const anim_new = function(params: Anim_New_Params): ac.Anim<ac.AnimSpring_Point> {
    const { effect, transpath, config_default } = params

    if (typeof transpath === "number") {
        return ac.anim_new_spring({
            ...config_default,

            effect,
            target: transpath
        })
    }

    return ac.anim_new_spring({
        effect,
        target: transpath.target,
        natfreq: transpath.natfreq || config_default.natfreq,
        dampratio: transpath.dampratio || config_default.dampratio,
        precision: transpath.precision || config_default.precision,
    })
}

export const usePathStyleMapSpring = function(params: UsePathStyleMapSpring_Params) {
    const { config: config_src } = params

    return usePathStyleMap({
        ref: params.ref,
        properties: params.properties,

        config: react.useMemo(
            () => inputdef_new_pipe(
                config_src,
                (config_default): PathDef_New_StyleMap_Config<ac.AnimSpring_Point, AnimStyleMapSpring_TransPath> => ({
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
