import type { PathApi, PathDef } from "#src/pathdef/type/PathDef.js";

export type PathDef_InferPoint<Src extends PathDef> = (
    (Src extends PathDef<infer Point>
        ? Point
        : never
    )
)

export type PathApi_InferPoint<Src extends PathApi> = (
    (Src extends PathApi<infer Point>
        ? Point
        : never
    )
)
