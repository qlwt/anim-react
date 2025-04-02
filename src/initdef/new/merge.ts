import type { InitDef } from "#src/initdef/type/InitDef.js"
import { inputdef_new_merge } from "#src/inputdef/new/merge.js"
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js"
import type { InputDef_InferOutput } from "#src/inputdef/type/InputDef_InferOutput.js"
import type * as ac from "@qyu/anim-core"

export type InitDef_New_Merge_Src_Generic = readonly InitDef["initapi"][]

export type InitDef_New_Merge_Src_PointMerge<Src extends InitDef_New_Merge_Src_Generic> = ac.AnimMerge_Point<{
    [K in keyof Src]: InputDef_InferOutput<Src[K]>
}>

type Src_Generic = InitDef_New_Merge_Src_Generic
type Src_PointMerge<Src extends Src_Generic> = InitDef_New_Merge_Src_PointMerge<Src>

export const initdef_new_merge = function <Src extends Src_Generic>(src: Src): InitDef<Src_PointMerge<Src>> {
    return {
        initapi: inputdef_new_pipe(
            inputdef_new_merge(src),
            src_os => ({
                init: () => {
                    return src_os.map(src_o => src_o.init()) as Src_PointMerge<Src>
                },

                changed: ipoint => {
                    for (let i = 0; i < src_os.length; ++i) {
                        const src_o = src_os[i]!
                        const ipoint_child = ipoint[i]!

                        if (src_o.changed(ipoint_child)) {
                            return true
                        }
                    }

                    return false
                },

                next: (ipoint, lpoint) => {
                    let change = false

                    const r_ipoint = new Array<any>()
                    const r_lpoint = new Array<any>()

                    for (let i = 0; i < src_os.length; ++i) {
                        const i_src_o = src_os[i]!
                        const i_ipoint_child = ipoint[i]!
                        const i_lpoint_child = lpoint[i]!
                        const i_src_o_update = i_src_o.next(i_ipoint_child, i_lpoint_child)

                        r_ipoint.push(i_src_o_update.ipoint)
                        r_lpoint.push(i_src_o_update.lpoint)

                        if (i_src_o_update.change) {
                            change = true
                        }
                    }

                    return {
                        change,
                        ipoint: r_ipoint as Src_PointMerge<Src>,
                        lpoint: r_lpoint as Src_PointMerge<Src>
                    }
                }
            })
        )
    }
}
