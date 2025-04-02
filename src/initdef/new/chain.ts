import type { InitDef } from "#src/initdef/type/InitDef.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type * as ac from "@qyu/anim-core";

export const initdef_new_chain = function <ChildPoint>(src: InitDef<ChildPoint>): InitDef<ac.AnimChain_Point<ChildPoint>> {
    return {
        initapi: inputdef_new_pipe(
            src.initapi,
            initapi_o => ({
                init: () => ({
                    ptr: 0,
                    child: initapi_o.init()
                }),

                changed: ipoint => {
                    return initapi_o.changed(ipoint.child)
                },

                next: (ipoint, lpoint) => {
                    const update = initapi_o.next(ipoint.child, lpoint.child)

                    if (update.change) {
                        return {
                            change: true,

                            ipoint: {
                                ptr: 0,
                                child: update.ipoint
                            },

                            lpoint: {
                                ptr: 0,
                                child: update.ipoint
                            }
                        }
                    }

                    return {
                        change: false,
                        ipoint: { ptr: ipoint.ptr, child: update.ipoint },
                        lpoint: { ptr: lpoint.ptr, child: update.lpoint }
                    }
                }
            })
        )
    }
}
