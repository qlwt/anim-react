import { useAnim } from "#src/hook/anim/index.js";
import { usePathSpring } from "#src/hook/path/spring.js";
import { useInitSpring } from "#src/hook/init/spring.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import type * as ac from "@qyu/anim-core";

export type UseAnimSpring_Params = {
    readonly init: InputDef<ac.AnimSpring_Point>
    readonly config: InputDef<ac.AnimNewSpring_Config>
}

export const useAnimSpring = function(params: UseAnimSpring_Params) {
    const { init, config } = params

    return useAnim(
        useInitSpring(init),
        usePathSpring(config)
    )
}
