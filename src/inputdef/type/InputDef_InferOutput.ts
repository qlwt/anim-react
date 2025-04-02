import type { InputDef } from "#src/inputdef/type/InputDef.js";

export type InputDef_InferOutput<
    Src extends InputDef<any>
> = Src extends InputDef<infer Output> ? Output : never
