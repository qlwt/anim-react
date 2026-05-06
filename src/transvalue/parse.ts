import { transvalue_new_csscolor } from "#src/transvalue/new/css/color.js"
import { transvalue_new_cssnumber } from "#src/transvalue/new/css/number.js"
import { transvalue_new_cssunit } from "#src/transvalue/new/css/unit.js"
import type { TransValue } from "#src/transvalue/type/TransValue.js"
import type { TransValue_CSSTarget } from "#src/transvalue/type/TransValue_CSSTarget.js"

type ParsedUnit = {
    readonly kind: "unit"
    readonly unit: string
    readonly value: number
}

type ParsedColor = {
    readonly kind: "color"
    readonly r: number
    readonly g: number
    readonly b: number
    readonly a: number
}

type ParsedNumber = {
    readonly kind: "number"
    readonly value: number
}

type Parsed = (
    | ParsedUnit
    | ParsedNumber
    | ParsedColor
)

const code_0 = "0".charCodeAt(0)
const code_9 = "9".charCodeAt(0)

const rawstr_parse = function(raw: string): Parsed | null {
    raw = raw.trim()

    const float = Number.parseFloat(raw)

    if (!Number.isNaN(float)) {
        // find a unit
        let i = raw.length - 1

        {
            const c = raw.charCodeAt(i)

            if (c >= code_0 && c <= code_9) {
                // if characted is a number - there is no unit
                return {
                    value: float,
                    kind: "number",
                }
            }

            // else - continue calculating the unit
            i -= 1
        }

        for (; i >= 0; --i) {
            const c = raw.charCodeAt(i)

            // if characted is a number - break the loop and calculate the unit
            if (c >= code_0 && c <= code_9) {
                break
            }

            continue
        }

        return {
            kind: "unit",
            value: float,
            unit: raw.slice(i + 1),
        }
    }

    if (raw.startsWith("rgb")) {
        const i_open = raw.indexOf("(")
        const i_close = raw.lastIndexOf(")")

        if (i_open !== -1 && i_close !== -1) {
            const args_raw = raw.slice(i_open + 1, i_close).split(",")

            switch (args_raw.length) {
                case 3: {
                    const r = Number.parseFloat(args_raw[0]!)
                    const g = Number.parseFloat(args_raw[1]!)
                    const b = Number.parseFloat(args_raw[2]!)

                    if (!Number.isFinite(r + g + b)) {
                        return null
                    }

                    return {
                        kind: "color",
                        r, g, b, a: 1
                    }
                }
                case 4: {
                    const r = Number.parseFloat(args_raw[0]!)
                    const g = Number.parseFloat(args_raw[1]!)
                    const b = Number.parseFloat(args_raw[2]!)
                    const a = Number.parseFloat(args_raw[3]!)

                    if (!Number.isFinite(r + g + b + a)) {
                        return null
                    }

                    return {
                        kind: "color",
                        r, g, b, a,
                    }
                }
            }

            return null
        }
    } else if (raw.startsWith("#")) {
        switch (raw.length) {
            case 4: {
                const r = Number.parseInt(raw[1]!, 16)
                const g = Number.parseInt(raw[2]!, 16)
                const b = Number.parseInt(raw[3]!, 16)

                if (Number.isNaN(r + g + b)) {
                    return null
                }

                return {
                    kind: "color",
                    r, g, b, a: 1
                }
            }
            case 7: {
                const r = Number.parseInt(raw.slice(1, 3)!, 16)
                const g = Number.parseInt(raw.slice(3, 5)!, 16)
                const b = Number.parseInt(raw.slice(5, 7)!, 16)

                if (Number.isNaN(r + g + b)) {
                    return null
                }

                return {
                    kind: "color",
                    r, g, b, a: 1
                }
            }
        }

        return null
    }

    return null
}

export type TransValue_Parse_Src = {
    readonly [K in string]?: string | null | TransValue<TransValue_CSSTarget, number, number>
}

export type TransValue_Parse_Output = {
    [K in string]: TransValue<TransValue_CSSTarget, number, number>
}

export const transvalue_parse = function(src: TransValue_Parse_Src): TransValue_Parse_Output {
    const result: TransValue_Parse_Output = {}
    const keys = Object.keys(src)

    for (const key of keys) {
        const raw = src[key]

        if (typeof raw === "string") {
            const parsed = rawstr_parse(raw)

            if (parsed !== null) {
                switch (parsed.kind) {
                    case "number": {
                        result[key] = transvalue_new_cssnumber<number, number>({
                            from: parsed.value,
                            target: parsed.value,
                        })

                        break
                    }
                    case "unit": {
                        result[key] = transvalue_new_cssunit<number, number>({
                            unit: parsed.unit,
                            from: parsed.value,
                            target: parsed.value,
                        })

                        break
                    }
                    case "color": {
                        result[key] = transvalue_new_csscolor<number, number>([
                            [parsed.r, parsed.r],
                            [parsed.g, parsed.g],
                            [parsed.b, parsed.b],
                            [parsed.a, parsed.a]
                        ])

                        break
                    }
                }
            }
        } else if (raw) {
            result[key] = raw
        }
    }

    return result
}
