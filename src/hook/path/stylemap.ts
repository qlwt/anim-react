import { pathdef_new_stylemap, type PathDef_New_StyleMap_Params } from "#src/pathdef/new/stylemap.js"
import * as react from "react"

type Params<ChildPoint, ChildPath> = PathDef_New_StyleMap_Params<ChildPoint, ChildPath>

export const usePathStyleMap = function <ChildPoint, ChildPath>(params: Params<ChildPoint, ChildPath>) {
    return react.useMemo(
        () => pathdef_new_stylemap(params),
        [params.ref, params.config, params.properties]
    )
}
