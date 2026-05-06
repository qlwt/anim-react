import type { Motion_Layout_Id, Motion_Layout_Id_Snapshot } from "#src/motion/layout/type/id.js"
import * as sc from "@qyu/signal-core"

export const motion__layout_id_new_local = function(): Motion_Layout_Id {
    return {
        snapshot: sc.signal_new_value<Motion_Layout_Id_Snapshot | null>(null),

        transforms: {
            left: sc.signal_new_value(0),
            top: sc.signal_new_value(0),
            width: sc.signal_new_value(0),
            height: sc.signal_new_value(0),
        },
    }
}
