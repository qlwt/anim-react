import type { Motion_Layout_Id } from "#src/motion/layout/type/id.js";
import { motion__layout_id_new_local } from "#src/motion/layout/util/id/new/local.js";
import * as r from "react";

export const useMotionLayoutIdLocal = function(): Motion_Layout_Id {
    return r.useMemo((): Motion_Layout_Id => {
        return motion__layout_id_new_local()
    }, [])
}
