import type { Steps } from './types';
declare const _default: () => {
    nextStep: () => void;
    previousStep: () => void;
    move: (by: number) => void;
    sidestep: (steps: Steps) => void;
    cancelSidestep: () => void;
};
export default _default;
