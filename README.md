# @qyu/anim-react

React hooks for `@qyu/anim-core` to manage declarative animations

## Concept

- Library mainly focuses on controled declarative animations
- It also provides some kinds of uncontrolled animations for convenience purpose

```tsx
import * as ar from "@qyu/anim-react"

const App = () => {
    const [target, target_set] = useState(100)
    const [velocity, velocity_set] = useState(1e-1)

    // run animation with animation frames 
    ar.useRunAnimInterval({
        src: ar.useAnimLine({
            init: ar.useInputConstant({
                state: 0
            }),

            config: ar.useInputDynamicSet({
                target,
                velocity,

                effect: state => {
                    console.log("Animation Tick: ", state)
                }
            }, [state])
        }),
    })

    return <>
        <button onClick={() => { target_set(target_old => target_old + 100) } }>
            Increase target {target}
        </button>

        <button onClick={() => { velocity_set(velocity_old => velocity_old * 2) } }>
            Increase velocity {velocity}
        </button>
    </>
}
```

## Animation Flow
- Create animation with `useAnim*` hook
- Pass it to `useRunAnim*` hook
- When initial condition changes - it restarts, when config changes - it adapts
- Process of continuing the animation from the current point with new config/target is called adapting

## Input Values
- To track the changes in input conditions, the special kind of value is used
- You create input with `useInput*` hook
- It is either static or dynamic kind. Dynamic allows controlling animation outside of react, while static will always restart animation on change
- There multiple ways of creating an InputValue:
    - `useInputConstant` is static and never changes
    - `useInputStatic` changes on deps change
    - `useInputStaticLazy` changes on deps change, accepts getter instead of a value
    - `useInputDynamic` created from signal, changes when source signal changes
    - `useInputDynamicSet` manages the signal itself, schedules an update after react render if deps have changed
    - `useInputDynamicSetLazy` manages the signal itself, schedules an update after react render if deps have changed, accepts getter instead of a value

## Running the animations
- Animations are ran by `useAnimRunInterval` hook
- It accepts the source animation, and some config
- `.spread` parameter means, that when there is multiple animations (eg. merged), when one restarts - it will try to preserve the state of others
- It runs animations using provided `.scheduler` parameter. If no `.scheduler` provided, it will use animation-frames in browser or `setTimeout` in node

## Kinds of controled animations

- Library implements many variants of controlled animations allowing to combine them into complex sequences
    - `useAnimLine` basic linear animation (A -> A1)
    - `useAnimSpring` basic spring animation (A -> A1)
    - `useAnimMerge` allows emitting multiple animation in parallel (A | B -> A1 | B1)
    - `useAnimSequence` emits animations one-by-one, will merge finished animation on adapt (A -> A1 & B -> B1)
    - `useAnimSequenceStrict` emits animation one-by-one, does not merge finished animations, so only emits one-at-a-time (A -> A1 & B -> B1)
    - `useAnimChain` is similar to the `Sequence`, but all animations in a `Chain` share the same point (A -> A1 -> A2)
    - `useAnimChainMap` is like a `Chain` but allows animating multiple threads with optional gaps (a: A, b: B -> a: A1 -> a: A2, b: B2)
    - `useAnimLoop` loops the animation (( A -> A1 ) * n)
    - `useAnimCluster` prevents `.spread` parameter in the runner to preserve the state. Meaning if one animation restarts - all do
    - `useAnimPlayback` speed up or slow down the animation
    - `useAnimPipe` allows to convert incompatible points (eg. for animating `chain(linear, spring)`)
    - `useStyleMapSpring` animates styles to given targets, uses spring animations
    - `useStyleMapLine` animates styles to given targets, uses linear animations

```tsx
import * as ar from "@qyu/anim-react"

const App = () => {
    const [target, target_set] = useState(100)

    ar.useRunAnimInterval({
        scheduler: scheduler_raf,

        // animates the same point in-order
        src: ar.useAnimChain([
            // adapt line point to the spring one
            ar.useAnimPipe({
                src: ar.useAnimLine({
                    init: ar.useInputConstant({
                        state: 0
                    }),

                    config: ar.useInputDynamicSet({
                        target: target,
                        velocity: 1e-1,

                        effect: state => {
                            console.log("Animation 1: ", state)
                        }
                    })
                }),

                pipei: (point_input: AnimSpring_Point): AnimLine_Point => ({
                    state: point_input.state
                }),

                pipeo: (point_input: AnimLine_Point): AnimSpring_Point => ({
                    state: point_input.state,
                    velocity: 1e-1
                }),
            }),

            // see later about usePath*
            ar.usePathSpring(ar.useInputDynamicSet({
                natfreq: 1e-2,
                dampratio: 0.1,
                target: target * 2,

                effect: state => {
                    console.log("Animation 2: ", state)
                }
            }))
        ] as const)
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

## Path and Init for animations
- Every animation defines `Init` and `Path` config
- `Init` tells how where to start, `Path` tells where (and how) to go
- `useAnim*` hooks define both `Init` and `Path`, `useInit*` and `usePath` allows to define them separately
- For `Chain` (and some others) animations share a `Point`, so only the first animation needs to define the `Init`, others can skip it

## Uncontrolled animations
- Uncontrolled animations can be used through `motion` components
- It includes `Layout` animations and simple to-target animations for styles

## Layout Animation
- When position or size of an element changes, it will be slowly animated to new position instead of instant change
- All changes to the component position must trigger a rerender of that component
- `transform` property is used to transition. That means layou changes instantly, only visual representation is animated
- `Element` should never reach the size of `0` as you can not scale the 0-size

```tsx
import * as ar from "@qyu/anim-react"
import { motion } from "@qyu/anim-react"

const App = () => {
    const [state, state_set] = r.useState(100)

    return <div>
        <button onClick={() => state_set(n => n + 6.28 * Math.random())}>
            Move
        </button>
        
        <motion.div
            // minimal setup
            layout
            // with config
            layout={{
                kind: "track",
                // transformOrigin of the element, center center is default
                origin: [0.5, 0.5],
                // providing id allows to do layou animation over different elements
                id: "red-square",
                // it uses spring animations, that is the default config
                anim_translate_config: { natfreq: 1e-2, dampratio: 1, },
                anim_scale_config: { natfreq: 1e-2, dampratio: 1, precision: { velocity: 1e-3, displacement: 1e-2 } },
            }}

            // this is just normal style property of a div, it is not animated by default
            style={{
                background: "red",
                width: `${(Math.sin(state) + 2) * 100}px`,
                height: `${(Math.cos(state) + 2) * 100}px`,

                position: "relative",
                left: `${(Math.sin(state) + 2) * 100}px`,
                top: `${(Math.cos(state) + 2) * 100}px`,
            }}
        />
    </div>
}
```

### Child Distortion

- Sometimes children of the animated `Element` may get distorted.
- In such cases you need to wrap them into their own `motion` component
- `layout="normalize"` will only animate position, while keeping scale stable
- Note, that `transform` property does not work on `inline` elements, so you need to set `display: inline-block`

```tsx
import * as ar from "@qyu/anim-react"
import { motion } from "@qyu/anim-react"

const App = () => {
    const [state, state_set] = r.useState(100)

    return <div>
        <button onClick={() => state_set(n => n + 6.28 * Math.random())}>
            Move
        </button>
        
        <motion.div
            layout

            style={{
                background: "red",
                width: `${(Math.sin(state) + 2) * 150}px`,
                height: `${(Math.cos(state) + 2) * 150}px`,

                position: "relative",
                left: `${(Math.sin(state) + 2) * 150}px`,
                top: `${(Math.cos(state) + 2) * 150}px`,
            }}
        >
            <motion.div layout>
                Text will be distorted
            </motion.div>

            <motion.div layout>
                <motion.span layout="normalize" style={{ display: "inline-block" }}>
                    Text will be preserved
                </motion.span>
            </motion.div>
        </motion.div>
    </div>
}
```

### Layout animations in scaled environments

- Lets see the following example

```tsx
import * as ar from "@qyu/anim-react"
import { motion } from "@qyu/anim-react"

const App = () => {
    const [state, state_set] = r.useState(100)

    return <div>
        <button onClick={() => state_set(n => n + 6.28 * Math.random())}>
            Move
        </button>
        
        <div style={{ width: "1000px", height: "1000px", background: "gray", transform: "scale(0.5)" }}>
            <motion.div
                layout

                style={{
                    background: "red",
                    width: `${(Math.sin(state) + 2) * 150}px`,
                    height: `${(Math.cos(state) + 2) * 150}px`,

                    position: "relative",
                    left: `${(Math.sin(state) + 2) * 150}px`,
                    top: `${(Math.cos(state) + 2) * 150}px`,
                }}
            />
        </div>
    </div>
}
```

- Here animated element stays inside of the element with `scale(0.5)` and it breaks the animation
- To avoid that, use `motion` element with `layout={{ kind: "static", scale: 0.5 }}`
- Layout animation can not be performed in a negative-scale environment

```tsx
import * as ar from "@qyu/anim-react"
import { motion } from "@qyu/anim-react"

const App = () => {
    const [state, state_set] = r.useState(100)

    return <div>
        <button onClick={() => state_set(n => n + 6.28 * Math.random())}>
            Move
        </button>
        
        <motion.div
            layout={{ kind: "static", scale: 0.5, }}
            style={{ width: "1000px", height: "1000px", background: "gray", transform: "scale(0.5)" }}
        >
            <motion.div
                layout

                style={{
                    background: "red",
                    width: `${(Math.sin(state) + 2) * 150}px`,
                    height: `${(Math.cos(state) + 2) * 150}px`,

                    position: "relative",
                    left: `${(Math.sin(state) + 2) * 150}px`,
                    top: `${(Math.cos(state) + 2) * 150}px`,
                }}
            />
        </motion.div>
    </div>
}
```

### Virtual Layout Animation

- When you can not directly render the element as `motion` element, you can still use virtual layout tracking

```tsx
import * as ar from "@qyu/anim-react"
import { motion } from "@qyu/anim-react"

const App = () => {
    const [state, state_set] = r.useState(100)

    return <div>
        <button onClick={() => state_set(n => n + 6.28 * Math.random())}>
            Move
        </button>

        <motion.div
            layout={{ kind: "static", scale: 0.5, }}
            style={{ width: "1000px", height: "1000px", background: "gray", transform: "scale(0.5)" }}
        >
            {/* must be rendered above the element */}
            <CmpMotion_LayoutVirtual layout target={() => ref_element.current}>
                <div
                    ref={ref_element}

                    style={{
                        background: "red",
                        width: `${(Math.sin(state) + 2) * 150}px`,
                        height: `${(Math.cos(state) + 2) * 150}px`,

                        position: "relative",
                        left: `${(Math.sin(state) + 2) * 150}px`,
                        top: `${(Math.cos(state) + 2) * 150}px`,
                    }}
                />
            </CmpMotion_LayoutVirtual>
        </motion.div>
    </div>
}
```

## To-Target style animations

- Animates styles of `motion` element to specified targets
- Uses spring animations
- Under the hood just runs `useAnimStyleMapSpring`, so interface is the same

```tsx
import * as ar from "@qyu/anim-react"
import { motion } from "@qyu/anim-react"

const App = () => {
    const [state, state_set] = r.useState(100)

    return <div>
        <button onClick={() => state_set(n => n + 100)}>
            Move
        </button>

        <motion.div 
            // that is the default config
            anim_style_config={{ natfreq: 1e-2, dampratio: 0.5, }}

            anim_style={ar.transvalue_parse({
                width: `${state}px`,
                background: `rgb(${( state + 100 ) % 256}, ${(state + 200) % 256}, ${(state + 300) % 256})`,

                height: ar.transvalue_new_cssunit({
                    from: 0,
                    unit: "px",
                    target: state,
                    // will restart when state goes beyound 500
                    deps: [state > 500],

                    config: {
                        tracker: { input: state => console.log(state) }
                    }
                }),
            })}
        />
    </div>
}
```

- It uses `TransValue` to determain the `Init`, `Path` and format of each property
- You can use `transvalue_parse` to identify common properties such as units (eg. 100px) or colors
- For colors only `rgb`, `rgba` and `hex` formats are available. You also need to put commas between arguments
- Transforms and other complex properties are not auto-recognised, you need to provide them manually
