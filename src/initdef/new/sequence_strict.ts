import type { InitDef } from "#src/initdef/type/InitDef.js"
import { inputdef_new_merge } from "#src/inputdef/new/merge.js"
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js"
import type { InputDef_InferOutput } from "#src/inputdef/type/InputDef_InferOutput.js"
import type * as ac from "@qyu/anim-core"

export type InitDef_New_SequenceStrict_Src_Generic = readonly InitDef["initapi"][]

export type InitDef_New_SequenceStrict_Src_InferPoint<Src extends InitDef_New_SequenceStrict_Src_Generic> = {
    [K in keyof Src]: InputDef_InferOutput<Src[K]>
}

export type InitDef_New_SequenceStrict_Src_Point<Src extends InitDef_New_SequenceStrict_Src_Generic> = ac.AnimSequenceStrict_Point<
    InitDef_New_SequenceStrict_Src_InferPoint<Src>
>

type Src_Generic = InitDef_New_SequenceStrict_Src_Generic
type Src_InferPoint<Src extends Src_Generic> = InitDef_New_SequenceStrict_Src_InferPoint<Src>
type Src_PointSequenceStrict<Src extends Src_Generic> = InitDef_New_SequenceStrict_Src_Point<Src>

export const initdef_new_sequence_strict = function <Src extends Src_Generic>(src: Src): InitDef<Src_PointSequenceStrict<Src>> {
    return {
        initapi: inputdef_new_pipe(
            inputdef_new_merge(src),
            src_os => ({
                init: () => {
                    return {
                        mergeptr: 0,
                        children: src_os.map(src_o => src_o.init()) as Src_InferPoint<Src>
                    }
                },

                changed: ipoint => {
                    for (let i = 0; i < src_os.length; ++i) {
                        const src_o = src_os[i]!
                        const ipoint_child = ipoint.children[i]!

                        if (src_o.changed(ipoint_child)) {
                            return true
                        }
                    }

                    return false
                },

                next: (ipoint, lpoint) => {
                    let change = false

                    const r_ipoint = new Array<Src_InferPoint<Src>[keyof Src]>()
                    const r_lpoint = new Array<Src_InferPoint<Src>[keyof Src]>()

                    for (let i = 0; i < src_os.length; ++i) {
                        const i_src_o = src_os[i]!
                        const i_ipoint_child = ipoint.children[i]!
                        const i_lpoint_child = lpoint.children[i]!
                        const i_src_o_update = i_src_o.next(i_ipoint_child, i_lpoint_child)

                        r_ipoint.push(i_src_o_update.ipoint)
                        r_lpoint.push(i_src_o_update.lpoint)

                        if (i_src_o_update.change) {
                            change = true
                        }
                    }

                    return {
                        change,

                        ipoint: { children: r_ipoint as Src_InferPoint<Src> },
                        lpoint: { children: r_lpoint as Src_InferPoint<Src> }
                    }
                }
            })
        )
    }
}
