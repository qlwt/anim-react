import { useAnim } from "#src/hook/anim/index.js"
import type { UseAnimStyleMap_Properties } from "#src/hook/anim/stylemap.js"
import { useInitStyleMapSpring, type AnimStyleMapSpring_TransInit } from "#src/hook/init/stylemap_spring.js"
import { usePathStyleMapSpring, type AnimStyleMapSpring_TransPath, type UsePathStyleMapSpring_ConfigDefault } from "#src/hook/path/stylemap_spring.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type { StyleTarget } from "#src/type/StyleTarget.js"

export type UseAnimStyleMapSpring_Params = {
    readonly ref: () => StyleTarget | null
    readonly config: InputDef<UsePathStyleMapSpring_ConfigDefault>
    readonly properties: InputDef<UseAnimStyleMap_Properties<AnimStyleMapSpring_TransInit, AnimStyleMapSpring_TransPath>>
}

export const useAnimStyleMapSpring = function (params: UseAnimStyleMapSpring_Params) {
    return useAnim(
        useInitStyleMapSpring(params),
        usePathStyleMapSpring(params),
    )
}
