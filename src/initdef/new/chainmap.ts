import type { InitDef } from "#src/initdef/type/InitDef.js";
import type { InitApi_InferPoint } from "#src/initdef/type/InitDef_InferPoint.js";
import { inputdef_new_mergemap } from "#src/inputdef/new/mergemap.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef_InferOutput } from "#src/inputdef/type/InputDef_InferOutput.js";
import type * as ac from "@qyu/anim-core";

export type InitDef_New_ChainMap_Src_Generic = {
    readonly [K in keyof any]: InitDef["initapi"]
}

export type InitDef_New_ChainMap_Src_InferPoint<Src extends InitDef_New_ChainMap_Src_Generic> = {
    readonly [K in keyof Src]: InitApi_InferPoint<InputDef_InferOutput<Src[K]>>
}

type Src_Generic = InitDef_New_ChainMap_Src_Generic
type Src_InferPoint<Src extends Src_Generic> = InitDef_New_ChainMap_Src_InferPoint<Src>

export const initdef_new_chainmap = function <Src extends Src_Generic>(src: Src): InitDef<ac.AnimChainMap_Point<Src_InferPoint<Src>>> {
    return {
        initapi: inputdef_new_pipe(
            inputdef_new_mergemap(src),

            src_os => ({
                init: () => ({
                    ptr: 0,
                    children: src_os as Src_InferPoint<Src>
                }),

                changed: ipoint => {
                    const keys = Object.keys(src_os)

                    for (let i = 0; i < keys.length; ++i) {
                        const key = keys[i]! as keyof Src
                        const src_o = src_os[key]
                        const ipoint_child = ipoint.children[key]

                        if (src_o.changed(ipoint_child)) {
                            return true
                        }
                    }

                    return false
                },

                next: (ipoint, lpoint) => {
                    const keys = Object.keys(src_os)
                    const r_ipoint: Partial<Src_InferPoint<Src>> = {}
                    const r_lpoint: Partial<Src_InferPoint<Src>> = {}

                    for (let i = 0; i < keys.length; ++i) {
                        const i_key = keys[i]! as keyof Src

                        const i_src_o = src_os[i_key]
                        const i_ipoint_child = ipoint.children[i_key]
                        const i_lpoint_child = lpoint.children[i_key]
                        const i_update = i_src_o.next(i_ipoint_child, i_lpoint_child)

                        if (!i_update.change) {
                            r_ipoint[i_key] = i_update.ipoint
                            r_lpoint[i_key] = i_update.lpoint

                            continue
                        }

                        r_ipoint[i_key] = i_update.ipoint
                        r_lpoint[i_key] = i_update.ipoint

                        for (let j = i + 1; j < keys.length; ++j) {
                            const j_key = keys[j]! as keyof Src

                            const j_src_o = src_os[j_key]
                            const j_ipoint_child = ipoint.children[j_key]
                            const j_lpoint_child = lpoint.children[j_key]
                            const j_update = j_src_o.next(j_ipoint_child, j_lpoint_child)

                            r_ipoint[j_key] = j_update.ipoint
                        }

                        return {
                            change: true,
                            ipoint: { ptr: 0, children: r_ipoint as Src_InferPoint<Src> },
                            lpoint: { ptr: 0, children: r_ipoint as Src_InferPoint<Src> },
                        }
                    }

                    return {
                        change: false,
                        ipoint: { ptr: ipoint.ptr, children: r_ipoint as Src_InferPoint<Src> },
                        lpoint: { ptr: ipoint.ptr, children: r_lpoint as Src_InferPoint<Src> }
                    }
                }
            })
        )
    }
}
