import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import * as ac from "@qyu/anim-core";

export const pathdef_new_spring = function(config: InputDef<ac.AnimNewSpring_Config>): PathDef<ac.AnimSpring_Point> {
    return {
        pathapi: inputdef_new_pipe(
            config,
            config_o => ac.anim_new_spring(config_o)
        )
    }
}

