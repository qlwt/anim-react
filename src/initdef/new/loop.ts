import type { InitDef } from "#src/initdef/type/InitDef.js";
import { inputdef_new_merge } from "#src/inputdef/new/merge.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import type * as ac from "@qyu/anim-core";

export type InitDef_New_Loop_Init = {
    readonly repeat: number
}

export type InitDef_New_Loop_Params<ChildPoint> = {
    readonly src: InitDef<ChildPoint>
    readonly init: InputDef<InitDef_New_Loop_Init>
}

export const initdef_new_loop = function <ChildPoint>(params: InitDef_New_Loop_Params<ChildPoint>): InitDef<ac.AnimLoop_Point<ChildPoint>> {
    const { src, init } = params

    return {
        initapi: inputdef_new_pipe(
            inputdef_new_merge([src.initapi, init] as const),
            ([src_o, init_o]) => ({
                init: () => ({
                    child: src_o.init(),
                    remaining: init_o.repeat,
                }),

                changed: ipoint => {
                    return src_o.changed(ipoint.child)
                },

                next: (ipoint, lpoint) => {
                    if (ipoint.remaining !== init_o.repeat) {
                        return {
                            change: true,
                            ipoint: { child: src_o.init(), remaining: init_o.repeat },
                            lpoint: { child: src_o.init(), remaining: init_o.repeat }
                        }
                    }

                    const update = src_o.next(ipoint.child, lpoint.child)

                    if (update.change) {
                        return {
                            change: true,
                            ipoint: { child: update.ipoint, remaining: ipoint.remaining },
                            lpoint: { child: update.ipoint, remaining: lpoint.remaining }
                        }
                    }

                    return {
                        change: false,
                        ipoint: { child: update.ipoint, remaining: ipoint.remaining },
                        lpoint: { child: update.lpoint, remaining: lpoint.remaining }
                    }
                }
            })
        )
    }
}
