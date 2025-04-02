import { useAnim } from "#src/hook/anim/index.js"
import type { AnimDef } from "#src/hook/anim/type/AnimDef.js"
import { usePathLoop } from "#src/hook/path/loop.js"
import { useInitLoop } from "#src/hook/init/loop.js"
import type { InitDef_New_Loop_Init } from "#src/initdef/new/loop.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"

export type UseAnimLoop_Params<ChildPoint> = {
    readonly src: AnimDef<ChildPoint>
    readonly init: InputDef<InitDef_New_Loop_Init>
}

export const useAnimLoop = function <ChildPoint>(params: UseAnimLoop_Params<ChildPoint>) {
    const { src, init } = params

    return useAnim(
        useInitLoop({ src, init: init }),
        usePathLoop(src)
    )
}
