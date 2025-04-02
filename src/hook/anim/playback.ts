import { useAnim } from "#src/hook/anim/index.js";
import type { AnimDef } from "#src/hook/anim/type/AnimDef.js";
import { usePathPlayback } from "#src/hook/path/playback.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import * as ac from "@qyu/anim-core";

export type UseAnimPlayback_Params<ChildPoint> = {
    readonly src: AnimDef<ChildPoint>
    readonly config: InputDef<ac.AnimNewPlayback_Config>
}

export const useAnimPlayback = function <ChildPoint>(params: UseAnimPlayback_Params<ChildPoint>) {
    const { src, config } = params

    return useAnim(
        src,
        usePathPlayback({ src, config })
    )
}
