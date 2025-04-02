import type { InitDef } from "#src/initdef/type/InitDef.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";

export const initdef_new_cluster = function <ChildPoint>(src: InitDef<ChildPoint>): InitDef<ChildPoint> {
    return {
        initapi: inputdef_new_pipe(src.initapi, initapi_o => ({
            init: () => initapi_o.init(),

            changed: ipoint => {
                return initapi_o.changed(ipoint)
            },

            next: (ipoint, lpoint) => {
                const update = initapi_o.next(ipoint, lpoint)

                if (update.change) {
                    return {
                        change: true,
                        ipoint: update.ipoint,
                        lpoint: update.ipoint
                    }
                }

                return update
            }
        }))
    }
}
