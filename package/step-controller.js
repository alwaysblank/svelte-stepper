import { createEventDispatcher } from 'svelte';
export default () => {
    const dispatch = createEventDispatcher();
    function nextStep() {
        dispatch('goForward');
    }
    function previousStep() {
        dispatch('goBackward');
    }
    function move(by) {
        dispatch('goForward', { by });
    }
    function sidestep(steps) {
        dispatch('sidestep', { steps });
    }
    function cancelSidestep() {
        dispatch('cancelSidestep');
    }
    return {
        nextStep,
        previousStep,
        move,
        sidestep,
        cancelSidestep
    };
};
