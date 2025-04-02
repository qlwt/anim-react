import { useAnim } from "#src/hook/anim/index.js"
import type { UseAnimStyleMap_Properties } from "#src/hook/anim/stylemap.js"
import { useInitStyleMapLine, type AnimStyleMapLine_TransInit } from "#src/hook/init/stylemap_line.js"
import { usePathStyleMapLine, type AnimStyleMapLine_TransPath, type UsePathStyleMapLine_ConfigDefault } from "#src/hook/path/stylemap_line.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type { StyleTarget } from "#src/type/StyleTarget.js"

export type UseAnimStyleMapLine_Params = {
    readonly ref: () => StyleTarget | null
    readonly config: InputDef<UsePathStyleMapLine_ConfigDefault>
    readonly properties: InputDef<UseAnimStyleMap_Properties<AnimStyleMapLine_TransInit, AnimStyleMapLine_TransPath>>
}

export const useAnimStyleMapLine = function (params: UseAnimStyleMapLine_Params) {
    return useAnim(
        useInitStyleMapLine(params),
        usePathStyleMapLine(params),
    )
}
