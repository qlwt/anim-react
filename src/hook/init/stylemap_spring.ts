import { useInitStyleMap } from "#src/hook/init/stylemap.js"
import type { InitDef_New_StyleMap_Properties } from "#src/initdef/new/stylemap.js"
import { inputdef_new_static } from "#src/inputdef/new/static.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type * as ac from "@qyu/anim-core"

export type AnimStyleMapSpring_TransInit = number | {
    readonly state: number
    readonly velocity?: number
}

export type UseInitStyleMapSpring_Params = {
    readonly properties: InputDef<InitDef_New_StyleMap_Properties<AnimStyleMapSpring_TransInit>>
}

const point_eq = function(a: ac.AnimSpring_Point, b: ac.AnimSpring_Point): boolean {
    return a.state === b.state && a.velocity === b.velocity
}

const point_new = function(init: AnimStyleMapSpring_TransInit): ac.AnimSpring_Point {
    if (typeof init === "number") {
        return {
            state: init,
            velocity: 0
        }
    }

    return {
        state: init.state,
        velocity: init.velocity || 0
    }
}

const init = inputdef_new_static({
    point_eq,
    point_new
} as const)

export const useInitStyleMapSpring = function(params: UseInitStyleMapSpring_Params) {
    return useInitStyleMap({
        init,

        properties: params.properties,
    })
}
