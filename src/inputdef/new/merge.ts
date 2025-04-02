import { inputdef_new_static } from "#src/inputdef/new/static.js";
import { InputDef_type, type InputDef, type InputDef_Static } from "#src/inputdef/type/InputDef.js";
import type { InputDef_InferOutput } from "#src/inputdef/type/InputDef_InferOutput.js";
import * as sc from "@qyu/signal-core";

type InputDefMerge_Output<Src extends readonly InputDef<any>[]> = {
    -readonly [K in keyof Src]: InputDef_InferOutput<Src[K]>
}

type Src_Generic = readonly InputDef[]

type Src_Constants<Src extends Src_Generic> = {
    [K in keyof Src]: InputDef_Static<InputDef_InferOutput<Src[K]>>
}

export const inputdef_new_merge = function <Src extends Src_Generic>(src: Src): InputDef<InputDefMerge_Output<Src>> {
    const src_signals = src.filter(mv => mv.type === InputDef_type.Dynamic)

    if (src_signals.length === 0) {
        return inputdef_new_static(
            (src as Src_Constants<Src>).map(
                mv => mv.value()
            ) as InputDefMerge_Output<Src>
        )
    }

    const src_esmerged = sc.esignal_new_merge(src_signals.map(mv => mv.value))

    const src_values = src.map(mv => {
        switch (mv.type) {
            case InputDef_type.Static:
                return mv.value
            case InputDef_type.Dynamic:
                return mv.value.output.bind(mv.value)
        }
    })

    return {
        type: InputDef_type.Dynamic,

        value: {
            rmsub(sub) {
                src_esmerged.rmsub(sub)
            },

            addsub(sub, config) {
                src_esmerged.addsub(sub, config)
            },

            output() {
                return src_values.map(v => v()) as InputDefMerge_Output<Src>
            }
        }
    }
}
