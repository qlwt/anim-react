import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { inputdef_new_merge } from "#src/inputdef/new/merge.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import * as ac from "@qyu/anim-core";

export type PathDef_New_Chain_Src<ChildPoint> = readonly PathDef<ChildPoint>["pathapi"][]

type Src<ChildPoint> = PathDef_New_Chain_Src<ChildPoint>

export const pathdef_new_chain = function <ChildPoint>(src_path: Src<ChildPoint>): PathDef<ac.AnimChain_Point<ChildPoint>> {
    return {
        pathapi: inputdef_new_pipe(
            inputdef_new_merge(src_path),
            src_path_value => ac.anim_new_chain(src_path_value)
        )
    }
}
