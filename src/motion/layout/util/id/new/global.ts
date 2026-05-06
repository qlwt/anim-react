import type { Motion_Layout_Id } from "#src/motion/layout/type/id.js"
import { motion__layout_id_new_local } from "#src/motion/layout/util/id/new/local.js"

const map = new Map<string, Motion_Layout_Id>()

export const motion__layout_id_new_global = function(index: string): Motion_Layout_Id {
    let id = map.get(index)

    if (!id) {
        id = motion__layout_id_new_local()

        map.set(index, id)
    }

    return id
}
