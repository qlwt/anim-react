import type { PathDef } from "#src/pathdef/type/PathDef.js"
import type { InitDef } from "#src/initdef/type/InitDef.js"

export interface AnimDef<Point = any> extends InitDef<Point>, PathDef<Point> { }
