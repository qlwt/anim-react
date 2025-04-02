import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { inputdef_new_merge } from "#src/inputdef/new/merge.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import * as ac from "@qyu/anim-core";

export type PathDef_New_Playback_Params<ChildPoint> = {
    readonly src: PathDef<ChildPoint>
    readonly config: InputDef<ac.AnimNewPlayback_Config>
}

type Params<ChildPoint> = PathDef_New_Playback_Params<ChildPoint>

export const pathdef_new_playback = function <ChildPoint>(params: Params<ChildPoint>): PathDef<ChildPoint> {
    const { src, config } = params

    return {
        pathapi: inputdef_new_pipe(
            inputdef_new_merge([src.pathapi, config] as const),
            ([pathapi_o, config_o]) => ac.anim_new_playback({
                src: pathapi_o,
                config: config_o
            })
        )
    }
}
