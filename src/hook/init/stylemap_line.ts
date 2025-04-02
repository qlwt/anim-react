import { useInitStyleMap } from "#src/hook/init/stylemap.js"
import type { InitDef_New_StyleMap_Properties } from "#src/initdef/new/stylemap.js"
import { inputdef_new_static } from "#src/inputdef/new/static.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type * as ac from "@qyu/anim-core"

export type AnimStyleMapLine_TransInit = number

export type UseInitStyleMapLine_Params = {
    readonly properties: InputDef<InitDef_New_StyleMap_Properties<AnimStyleMapLine_TransInit>>
}

const point_eq = function(a: ac.AnimLine_Point, b: ac.AnimLine_Point): boolean {
    return a.state === b.state
}

const point_new = function(init: AnimStyleMapLine_TransInit): ac.AnimLine_Point {
    return {
        state: init,
    }
}

const init = inputdef_new_static({
    point_eq,
    point_new
} as const)

export const useInitStyleMapLine = function(params: UseInitStyleMapLine_Params) {
    return useInitStyleMap({
        init,

        properties: params.properties,
    })
}
