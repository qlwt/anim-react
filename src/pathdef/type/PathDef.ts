import type { InputDef } from "#src/inputdef/type/InputDef.js";
import type { Anim } from "@qyu/anim-core";

export type PathApi<Point = any> = Anim<Point>

export type PathDef<Point = any> = {
    readonly pathapi: InputDef<PathApi<Point>>
}
