import { pathdef_new_playback, type PathDef_New_Playback_Params } from "#src/pathdef/new/playback.js";
import { useMemo } from "react";

export const usePathPlayback = function <ChildPoint>(params: PathDef_New_Playback_Params<ChildPoint>) {
    return useMemo(
        () => pathdef_new_playback(params),
        [params.src.pathapi, params.config]
    )
}
