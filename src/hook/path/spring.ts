import type { InputDef } from "#src/inputdef/type/InputDef.js";
import { pathdef_new_spring } from "#src/pathdef/new/spring.js";
import * as ac from "@qyu/anim-core";
import { useMemo } from "react";

export const usePathSpring = function(config: InputDef<ac.AnimNewSpring_Config>) {
    return useMemo(
        () => pathdef_new_spring(config),
        [config]
    )
}

