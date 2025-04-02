import type { InitApi, InitDef } from "#src/initdef/type/InitDef.js";

export type InitDef_InferPoint<Src extends InitDef> = (
    (Src extends InitDef<infer Point>
        ? Point
        : never
    )
)

export type InitApi_InferPoint<Src extends InitApi> = (
    (Src extends InitApi<infer Point>
        ? Point
        : never
    )
)
