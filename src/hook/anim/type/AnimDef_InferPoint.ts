import type { AnimDef } from "#src/hook/anim/type/AnimDef.js";

export type AnimDef_InferPoint<Src extends AnimDef> = (Src extends AnimDef<infer O>
    ? O
    : never
)
