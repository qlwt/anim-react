import { useAnim } from "#src/hook/anim/index.js";
import type { AnimDef } from "#src/hook/anim/type/AnimDef.js";
import { usePathPipe } from "#src/hook/path/pipe.js";
import { useInitPipe } from "#src/hook/init/pipe.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import * as ac from "@qyu/anim-core";

export type UseAnimPipe_Params<PointSrc, PointOut> = {
    readonly src: AnimDef<PointSrc>
    readonly config: InputDef<ac.AnimNewPipe_Config<PointSrc, PointOut>>
}

export const useAnimPipe = function <PointSrc, PointOut>(params: UseAnimPipe_Params<PointSrc, PointOut>) {
    const { src, config } = params

    return useAnim(
        useInitPipe({ src, config }),
        usePathPipe({ src, config })
    )
}
