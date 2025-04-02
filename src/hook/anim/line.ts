import { useAnim } from "#src/hook/anim/index.js";
import { usePathLine } from "#src/hook/path/line.js";
import { useInitLine } from "#src/hook/init/line.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import type * as ac from "@qyu/anim-core";

export type UseAnimLine_Params = {
    readonly init: InputDef<ac.AnimLine_Point>
    readonly config: InputDef<ac.AnimNewLine_Config>
}

export const useAnimLine = function(params: UseAnimLine_Params) {
    const { init, config } = params

    return useAnim(
        useInitLine(init),
        usePathLine(config)
    )
}
