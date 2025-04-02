import { inputdef_new_static } from "#src/inputdef/new/static.js"
import { inputdef_new_dynamic } from "#src/inputdef/new/dynamic.js"
import { InputDef_type, type InputDef, type InputDef_Static } from "#src/inputdef/type/InputDef.js"
import type { InputDef_InferOutput } from "#src/inputdef/type/InputDef_InferOutput.js"
import * as sc from "@qyu/signal-core"

type SrcGeneric = {
    readonly [K in keyof any]: InputDef<any>
}

type Src_Output<Src extends SrcGeneric> = {
    -readonly [K in keyof Src]: InputDef_InferOutput<Src[K]>
}

type Src_InputDefMergeMap<Src extends SrcGeneric> = InputDef<Src_Output<Src>>

export const inputdef_new_mergemap = function <Src extends SrcGeneric>(src: Src): Src_InputDefMergeMap<Src> {
    const src_signals = Object.values(src).filter(
        v => v.type === InputDef_type.Dynamic
    ).map(v => v.value)

    if (src_signals.length === 0) {
        const output = {} as Src_Output<Src>

        for (const [key, key_value] of Object.entries(src)) {
            output[key as keyof Src] = (key_value as InputDef_Static<any>).value()
        }

        return inputdef_new_static(output)
    }

    const esignal = sc.esignal_new_merge(src_signals)

    return inputdef_new_dynamic({
        rmsub(sub) {
            esignal.rmsub(sub)
        },

        addsub(sub, config) {
            esignal.addsub(sub, config)
        },

        output() {
            const output = {} as Src_Output<Src>

            for (const [key, key_value] of Object.entries(src)) {
                switch (key_value.type) {
                    case InputDef_type.Dynamic: {
                        output[key as keyof Src] = key_value.value.output()

                        break
                    }
                    case InputDef_type.Static: {
                        output[key as keyof Src] = key_value.value()

                        break
                    }
                }
            }

            return output
        },
    })
}
