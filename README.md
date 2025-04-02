# @qyu/anim-react

React hooks for @qyu/anim-core to create and run declarative animations

## Concept
- Create animation with useAnim* hook
- When Initial condition change - animation restarts, When target or config changes - animation updates without restarting
- Animations by the most part accept special type of input that is created with useInput* hooks. It allows to communicate updates to animation
- Pass created Animation to useRunAnim* hook

## Animate Styles with springs

```typescriptreact
// create scheduler for browser, for native or node, use (Date, setTimeout, clearTimeout)
const scheduler_raf = fscheduler_new_frame(performance, requestAnimationFrame, cancelAnimationFrame)

const App = () => {
    const tracker = useMemo(() => signal_new_value(0), [])
    // animation will incrementally update when config changes
    const [natfreq, natfreq_set] = useState(1e-2)
    // animation will incrementally update when target changes
    const [width_target, width_target_set] = useState(500)
    const ref_element = useRef<HTMLDivElement | null>(null)

    // run animation with animation frames 
    useRunAnimInterval({
        // for fscheduler look at @qyu/anim-core
        scheduler: scheduler_raf,
        // will treat child animations individually as much as posiible
        // that means when one of children changes it's initial value it will restart without affecting unrelated animations
        // if false (by default) - runner will treat animation as monolith
        spread: true,

        src: useAnimStyleMapSpring({
            // target element
            ref: useRefObject(ref_element),

            // default config for animations
            config: useInputDynamicSet({
                natfreq,
                dampratio: 0.1,
            }),

            // useInputDynamicSet means 
            properties: useInputDynamicSet({
                height: transvalue_new_cssunit({ from: 0, target: 400, unit: "px" }),
                // when widht_target updates - this animation will also update
                // you can override default config
                width: transvalue_new_cssunit({ from: 0, target: { target: width_target, natfreq: 1e-3 }, unit: "px" }),
                // color animation
                // property names are not transformed = need to preserve dashes
                // use tracker param to track value of something
                // no animation on green param
                "background-color": transvalue_new_csscolor([[0, 200], 150, [0, 255, { tracker }], [0.2, 0.8]]),

                transform: transvalue_new_csstransform({
                    // no animation on this one
                    translateX: "100px",

                    // specific config for property
                    scaleX: transvalue_new_cssnumber({
                        from: 1,

                        target: {
                            target: 1.6,
                            natfreq: 5e-3,

                            precision: {
                                velocity: 1e-4,
                                displacement: 1e-5
                            }
                        },
                    })
                })
            })
        }),
    })

    return <>
        <button onClick={() => { natfreq_set(natfreq_old => natfreq_old * 2) } }>
            Increase natfreq {natfreq}
        </button>

        <button onClick={() => { width_target_set(width_target_old => width_target_old + 500) } }>
            Increase width_target {width_target}
        </button>

        <div ref={ref_element} />
    </>
}
```

## Basic Linear animation

Animation will continuosly update on path conditions change (for linear animation it's config), but restart on initial conditions change. This works for all types of animations

```typescriptreact
const scheduler_raf = fscheduler_new_frame(performance, requestAnimationFrame, cancelAnimationFrame)

const App = () => {
    const [target, target_set] = useState(100)
    const [velocity, velocity_set] = useState(1e-1)

    // run animation with animation frames 
    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimLine({
            init: useInputConstant({
                state: 0
            }),

            config: useInputDynamicSet({
                target,
                velocity,

                effect: state => {
                    console.log("Animation Tick: ", state)
                }
            })
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

## useInput* hooks

Animations take special kind of input created with useInput hooks

```typescriptreact
// will never update no matter what
useInputConstant(10)
// will update when dependencies change
// dependencies can be ignored, then it will update when provided value changes
// as it updates will return new value and consequentially restart the animation
useInputStatic(10, [])
// accepts signal as parameter, when value in signal changes sends update to dependent animations
useInputDynamic(useSignalValue(10, [deps]))
// the same as previous one, just merged into one
useInputDynamicSet(10, [deps])
```

## usePath* and useInit* hooks

useAnim* hook creates whole animation, but useInit* and usePath* hooks can be used to only create point or path definition
Almost all of animation variants have both useAnim, usePath and useInit variants

```typescriptreact
// does not request whole anim definition in links, see later
useAnimChain([
    useAnimLine({
        init: useInputConstant({
            state: 0
        }),

        config: useInputDynamicSet({
            target: 100,
            velocity: 1e-2,

            effect: state => {
                console.log("Animation Tick: ", state)
            }
        })
    }),

    // only defining path
    usePathLine(useInputDynamicSet({
        target: 100,
        velocity: 1e-2,

        effect: state => {
            console.log("Animation Tick: ", state)
        }
    }))
] as const)
```

## Creating Animation

### Line

Linear animation

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimLine({
            init: useInputConstant({
                state: 0
            }),

            config: useInputDynamicSet({
                target: target,
                velocity: 1e-1,

                effect: state => {
                    console.log("Animation 1: ", state)
                }
            })
        })
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

### Spring

Spring-like animation

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimSpring({
            init: useInputConstant({
                state: 0,
                velocity: -100,
            }),

            config: useInputDynamicSet({
                target: target,
                // bigger faster
                natfreq: 1e-3,
                // dampratio < 1 - will overshoot, >= 1 will not overshoot, dampratio <= 0 - inifinite animation
                dampratio: 0.1,

                // will forcefully finish animation when it's too slow and close to target
                precision: {
                    velocity: 1e-3,
                    displacement: 1e-4,
                },

                effect: state => {
                    console.log("Animation 1: ", state)
                }
            })
        })
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

### Playback

Speed up or slow down animation

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimPlayback({
            config: useInputDynamicSet({
                multiplire: 2.5
            }),

            src: useAnimSpring({
                init: useInputConstant({
                    state: 0,
                    velocity: -100,
                }),

                config: useInputDynamicSet({
                    target: target,
                    natfreq: 1e-3,
                    dampratio: 0.1,

                    effect: state => {
                        console.log("Animation 1: ", state)
                    }
                })
            })
        })
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

### Sequence

Emit animations in sequence, if animation completed once, when target updated it will emit in parallel

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimSequence([
            useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 1: ", state)
                    }
                })
            }),

            useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target * 2,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 2: ", state)
                    }
                })
            })
        ] as const)
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

### Sequence Strict

Init animations in sequence, but only emit one at a time event if it has finished before

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimSequenceStrict([
            useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 1: ", state)
                    }
                })
            }),

            useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target * 2,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 2: ", state)
                    }
                })
            })
        ] as const)
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

### Merge

Init animations in parallel

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimMerge([
            useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 1: ", state)
                    }
                })
            }),

            useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target * 2,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 2: ", state)
                    }
                })
            })
        ] as const)
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

### Chain

Emit animations in sequence, but with shared point

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    // first element should be animation definition
    // chain links share point so no need to define init futher
    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimChain([
            useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 1: ", state)
                    }
                })
            }),

            usePathLine(useInputDynamicSet({
                target: target * 2,
                velocity: 1e-1,

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

### ChainMap

Like chain but with threads

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    // First element of each thread should be animation definition
    // Thread share point, not need to define init futher
    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimChainMap([
            {
                thread_a: useAnimLine({
                    init: useInputConstant({
                        state: 0
                    }),

                    config: useInputDynamicSet({
                        target: target,
                        velocity: 1e-1,

                        effect: state => {
                            console.log("Animation 1a: ", state)
                        }
                    })
                })
            },

            {
                thread_a: usePathLine({
                    init: useInputConstant({
                        state: 0
                    }),

                    config: useInputDynamicSet({
                        target: target * 2,
                        velocity: 1e-1,

                        effect: state => {
                            console.log("Animation 2a: ", state)
                        }
                    })
                }),

                thread_b: useAnimLine({
                    init: useInputConstant({
                        state: 0
                    }),

                    config: useInputDynamicSet({
                        target: target,
                        velocity: 1e-1,

                        effect: state => {
                            console.log("Animation 1b: ", state)
                        }
                    })
                })
            }
        ] as const)
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

### Loop

Repeat an animation

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimLoop({
            src: useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 1a: ", state)
                    }
                })
            }),

            init: useInputConstant({
                // will make it first time and then repeat 3 times
                repeat: 3
            })
        })
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

### Merge Init and Path together

```typescriptreact
    const App = () => {
        const [target, target_set] = useState(100)

        useRunAnimInterval({
            scheduler: scheduler_raf,

            src: useAnim(
                useInitLine(useInputConstant({
                    state: 0
                })),

                usePathLine(useInputDynamicSet({
                    target: target,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 1a: ", state)
                    }
                })
            ),
        })

        return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
            Increase target {target}
        </button>
    }
```

### Pipe

Adapt animation for different kind of point

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    // first element should be animation definition
    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimChain([
            useAnimPipe({
                src: useAnimLine({
                    init: useInputConstant({
                        state: 0
                    }),

                    config: useInputDynamicSet({
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

            usePathSpring(useInputDynamicSet({
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

### Cluster

Makes animation monolith, when one updates initial conditions - restarts the whole thing

```typescriptreact
const App = () => {
    const [target, target_set] = useState(100)

    useRunAnimInterval({
        scheduler: scheduler_raf,

        src: useAnimCluster(useAnimMerge([
            useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 1: ", state)
                    }
                })
            }),

            useAnimLine({
                init: useInputConstant({
                    state: 0
                }),

                config: useInputDynamicSet({
                    target: target * 2,
                    velocity: 1e-1,

                    effect: state => {
                        console.log("Animation 2: ", state)
                    }
                })
            })
        ] as const))
    })

    return <button onClick={ () => { target_set(target_old => target_old + 100) } }>
        Increase target {target}
    </button>
}
```

### StyleMapSpring

Animate ref's styles with springs

```typescriptreact
const App = () => {
    const [natfreq, natfreq_set] = useState(1e-2)
    const [width_target, width_target_set] = useState(500)
    const ref_element = useRef<HTMLDivElement | null>(null)

    // run animation with animation frames 
    useRunAnimInterval({
        scheduler: scheduler_raf,
        // will treat child animations individually as much as posiible
        // that means when one of children changes it's initial value it will restart without affecting unrelated animations
        // if false (by default) - runner will treat animation as monolith
        spread: true,

        src: useAnimStyleMapSpring({
            // target element
            ref: useRefObject(ref_element),

            // default config for animations
            config: useInputDynamicSet({
                natfreq,
                dampratio: 0.1,
            }),

            // useInputDynamicSet means 
            properties: useInputDynamicSet({
                height: transvalue_new_cssunit({ from: 0, target: 400, unit: "px" }),
                // when widht_target updates - this animation will also update
                width: transvalue_new_cssunit({ from: 0, target: width_target, unit: "px" }),
                // color animation
                // property names are not transformed = need to preserve dashes
                "background-color": transvalue_new_csscolor([[0, 200], [0, 150], [0, 255], [120, 255]]),

                transform: transvalue_new_csstransform({
                    // specific config for property
                    scaleX: transvalue_new_cssnumber({
                        from: 1,

                        target: {
                            target: 1.6,
                            natfreq: 5e-3,

                            precision: {
                                velocity: 1e-4,
                                displacement: 1e-5
                            }
                        },
                    })
                })
            })
        }),
    })

    return <>
        <button onClick={() => { natfreq_set(natfreq_old => natfreq_old * 2) } }>
            Increase natfreq {natfreq}
        </button>

        <button onClick={() => { width_target_set(width_target_old => width_target_old + 500) } }>
            Increase width_target {width_target}
        </button>

        <div ref={ref_element} />
    </>
}
```

### StyleMapLine

Animate styles of target with line

```typescriptreact
const App = () => {
    const [velocity, velocity_set] = useState(1e-2)
    const [width_target, width_target_set] = useState(500)
    const ref_element = useRef<HTMLDivElement | null>(null)

    // run animation with animation frames 
    useRunAnimInterval({
        scheduler: scheduler_raf,
        // will treat child animations individually as much as posiible
        // that means when one of children changes it's initial value it will restart without affecting unrelated animations
        // if false (by default) - runner will treat animation as monolith
        spread: true,

        src: useAnimStyleMapLine({
            // target element
            ref: useRefObject(ref_element),

            // default config for animations
            config: useInputDynamicSet({
                velocity
            }),

            // useInputDynamicSet means 
            properties: useInputDynamicSet({
                height: transvalue_new_cssunit({ from: 0, target: 400, unit: "px" }),
                // when widht_target updates - this animation will also update
                width: transvalue_new_cssunit({ from: 0, target: width_target, unit: "px" }),
                // color animation
                // property names are not transformed = need to preserve dashes
                "background-color": transvalue_new_csscolor([[0, 200], [0, 150], [0, 255], [120, 255]]),

                transform: transvalue_new_csstransform({
                    // specific config for property
                    scaleX: transvalue_new_cssnumber({
                        from: 1,

                        target: {
                            target: 1.6,
                            velocity: 1e-4
                        },
                    })
                })
            })
        }),
    })

    return <>
        <button onClick={() => { velocity_set(velocity_old => velocity_old * 2) } }>
            Increase velocity {velocity}
        </button>

        <button onClick={() => { width_target_set(width_target_old => width_target_old + 500) } }>
            Increase width_target {width_target}
        </button>

        <div ref={ref_element} />
    </>
}
```
