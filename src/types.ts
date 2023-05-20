import type {Component} from "vue";

export interface ScrollRevealItem {
    key: string,
    component: string|Component,

    class?: unknown,
    style?: unknown,
    props: Record<string, unknown>,

    on?: Record<string, Function>,

    startFrame: number,
    endFrame: number
}

export type FrameCallback = (time: number, delta: number) => void