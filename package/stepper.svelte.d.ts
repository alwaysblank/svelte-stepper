import { type TransitionConfig } from 'svelte/transition';
import type { Steps } from './types';
import type { Writable } from 'svelte/store';
declare class __sveltets_Render<CT> {
    props(): {
        steps: Steps;
        context?: (() => Writable<CT>) | undefined;
        padding?: string | undefined;
        defaultTransitionDuration?: number;
        disableTransitions?: boolean;
        stepIntroTransition?: {
            transitionFn: (node: Element, params: Record<string, unknown>) => TransitionConfig;
            params: (direction: "forward" | "backward") => Record<string, unknown>;
        } | undefined;
        stepOutroTransition?: {
            transitionFn: (node: Element, params: Record<string, unknown>) => TransitionConfig;
            params: (direction: "forward" | "backward") => Record<string, unknown>;
        } | undefined;
    };
    events(): {
        stepChange: CustomEvent<{
            newIndex: number;
            of: number;
            direction: "forward" | "backward";
        }>;
        conclusion: CustomEvent<null | undefined>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
    bindings(): string;
    exports(): {};
}
interface $$IsomorphicComponent {
    new <CT>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<CT>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<CT>['props']>, ReturnType<__sveltets_Render<CT>['events']>, ReturnType<__sveltets_Render<CT>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<CT>['bindings']>;
    } & ReturnType<__sveltets_Render<CT>['exports']>;
    <CT>(internal: unknown, props: ReturnType<__sveltets_Render<CT>['props']> & {
        $$events?: ReturnType<__sveltets_Render<CT>['events']>;
    }): ReturnType<__sveltets_Render<CT>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const Stepper: $$IsomorphicComponent;
type Stepper<CT> = InstanceType<typeof Stepper<CT>>;
export default Stepper;
