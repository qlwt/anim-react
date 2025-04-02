import { inputdef_new_dynamic } from "#src/inputdef/new/dynamic.js"
import { inputdef_new_static } from "#src/inputdef/new/static.js"
import { InputDef_type, type InputDef } from "#src/inputdef/type/InputDef.js"
import { attachment_new_lazy, type OSignal } from "@qyu/signal-core"

type Src_Generic = InputDef<InputDef | undefined>

type InputDefFlat_Output<Src extends Src_Generic> = (
    (Src extends InputDef<InputDef<infer T>>
        ? T
        : (Src extends InputDef<InputDef<infer T> | undefined>
            ? T | undefined
            : never
        )
    )
)

export const inputdef_new_flat = function <Src extends Src_Generic>(src: Src): InputDef<InputDefFlat_Output<Src>> {
    if (src.type === InputDef_type.Static) {
        const src_value = src.value()

        return src_value || inputdef_new_static(() => undefined)

    }

    let target: OSignal | null = null

    const src_sub = () => {
        const src_output = src.value.output()

        target?.rmsub(target_sub)

        switch (src_output?.type) {
            case undefined:
            case InputDef_type.Static: {
                target = null

                break
            }
            case InputDef_type.Dynamic: {
                const newtarget = src_output.value

                target = newtarget

                newtarget.addsub(target_sub, { instant: true })

                break
            }
        }

        target_sub()
    }

    const target_sub = () => {
        attachment.emit()
    }

    const attachment = attachment_new_lazy(
        () => {
            src.value.addsub(src_sub, { instant: true })

            const src_output = src.value.output()

            if (src_output?.type === InputDef_type.Dynamic) {
                target = src_output.value

                src_output.value.addsub(target_sub, { instant: true })
            }
        },
        () => {
            const oldtarget = target

            target = null

            src.value.rmsub(src_sub)
            oldtarget?.rmsub(target_sub)
        }
    )

    return inputdef_new_dynamic({
        addsub(sub, config) {
            attachment.addsub(sub, config)
        },

        rmsub(sub) {
            attachment.rmsub(sub)
        },

        output() {
            const src_output = src.value.output()

            switch (src_output?.type) {
                case undefined:
                    return undefined
                case InputDef_type.Static:
                    return src_output.value()
                case InputDef_type.Dynamic:
                    return src_output.value.output()
            }
        },
    })
}
