import type { InitDef } from "#src/initdef/type/InitDef.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import type * as ac from "@qyu/anim-core";

export const initdef_new_line = function (point: InputDef<ac.AnimLine_Point>): InitDef<ac.AnimLine_Point> {
    return {
        initapi: inputdef_new_pipe(point, point_o => ({
            init: () => point_o,

            changed: ipoint => {
                return ipoint.state !== point_o.state
            },

            next: (ipoint, lpoint) => {
                if (ipoint.state !== point_o.state) {
                    return {
                        change: true,
                        ipoint: point_o,
                        lpoint: point_o
                    }
                }

                return {
                    change: false,
                    ipoint,
                    lpoint
                }
            }
        }))
    }
}
