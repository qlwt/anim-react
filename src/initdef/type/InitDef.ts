import type { InputDef } from "#src/inputdef/type/InputDef.js";

export type InitApi_Next_Update<Point = any> = {
    readonly ipoint: Point
    readonly lpoint: Point
    readonly change: boolean
}

export type InitApi<Point = any> = {
    init: () => Point
    changed: (initial: Point) => boolean
    next: (initial: Point, last: Point) => InitApi_Next_Update<Point>
}

export type InitDef<Point = any> = {
    readonly initapi: InputDef<InitApi<Point>>
}
