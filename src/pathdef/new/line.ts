import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import * as ac from "@qyu/anim-core";

export const pathdef_new_line = function(config: InputDef<ac.AnimNewLine_Config>): PathDef<ac.AnimLine_Point> {
    return {
        pathapi: inputdef_new_pipe(
            config,
            config_o => ac.anim_new_line(config_o)
        )
    }
}
