<script lang="ts" generics="CT">import { fly } from "svelte/transition";
import { createEventDispatcher, onDestroy, onMount, tick } from "svelte";
import { tweened } from "svelte/motion";
import { cubicInOut } from "svelte/easing";
import { BROWSER } from "esm-env";
const dispatch = createEventDispatcher();
export let steps;
export let context = void 0;
const resolvedContext = context?.();
export let padding = void 0;
export let defaultTransitionDuration = 500;
export let disableTransitions = false;
export let stepIntroTransition = {
  transitionFn: fly,
  params: (direction2) => getTransitionParams("in", direction2)
};
$:
  introTransition = stepIntroTransition.transitionFn;
$:
  introTransitionParams = stepIntroTransition.params;
export let stepOutroTransition = {
  transitionFn: fly,
  params: (direction2) => getTransitionParams("out", direction2)
};
$:
  outroTransition = stepOutroTransition.transitionFn;
$:
  outroTransitionParams = stepOutroTransition.params;
let stepElement;
let internalSteps = steps;
$:
  resolvedSteps = internalSteps.map((someStep) => someStep((i) => i));
let currentStepIndex = 0;
$:
  currentStep = resolvedSteps[currentStepIndex];
let direction = "forward";
async function move(by) {
  direction = by > 0 ? "forward" : "backward";
  currentStepIndex += by;
  return new Promise((resolve) => transitionEndListener = resolve);
}
function getTransitionParams(inOrOut, direction2) {
  if (disableTransitions)
    return { x: 0, duration: 0 };
  let x;
  if (inOrOut === "in") {
    x = direction2 === "forward" ? 128 : -128;
  } else {
    x = direction2 === "forward" ? -128 : 128;
  }
  return { x, duration: defaultTransitionDuration, easing: cubicInOut };
}
let transitioning = false;
let transitionEndListener = void 0;
function setTransitioning(newVal) {
  if (newVal === false)
    transitionEndListener?.();
  transitioning = newVal;
}
let containerHeight = tweened(0);
let resizeObserver = BROWSER ? new ResizeObserver(() => updateContainerHeight()) : void 0;
let observedElement;
async function updateResizeObserver() {
  await tick();
  resizeObserver?.disconnect();
  if (BROWSER && stepElement instanceof HTMLDivElement) {
    observedElement = stepElement;
    resizeObserver?.observe(stepElement);
    updateContainerHeight();
  }
}
let firstHeightUpdate = true;
async function updateContainerHeight() {
  if (!observedElement)
    return;
  const stepHeight = observedElement.offsetHeight;
  containerHeight.set(stepHeight, {
    duration: firstHeightUpdate || !transitioning ? 0 : defaultTransitionDuration,
    easing: cubicInOut
  });
  firstHeightUpdate = false;
}
function handleGoForward(event) {
  const by = event.detail?.by ?? 1;
  if (!resolvedSteps[currentStepIndex + by]) {
    handleConclusion();
    return;
  }
  move(by);
  emitStepChange();
}
function handleGoBackward(event) {
  const by = event.detail?.by ?? -1;
  if (!resolvedSteps[currentStepIndex + by]) {
    throw new Error("Unable to go back further than the first step");
  }
  move(event.detail?.by ?? -1);
  emitStepChange();
}
let sidestepConfig = void 0;
let originalSteps = void 0;
let originalStepIndex = void 0;
async function handleSidestep(event) {
  if (sidestepConfig)
    throw new Error("There's already an active sidestep");
  originalStepIndex = currentStepIndex;
  sidestepConfig = event.detail;
  originalSteps = [...steps];
  internalSteps = [steps[currentStepIndex], ...event.detail.steps];
  currentStepIndex = 0;
  emitStepChange();
  await move(1);
  disableTransitions = true;
  internalSteps = [...event.detail.steps];
  currentStepIndex = 0;
  await tick();
  disableTransitions = false;
}
function handleCancelSidestep() {
  if (!sidestepConfig)
    throw new Error("There's currently no active sidestep to cancel");
  handleConclusion();
}
async function handleConclusion() {
  if (sidestepConfig && originalStepIndex !== void 0 && originalSteps) {
    emitStepChange(originalStepIndex, originalSteps.length - 1, "backward");
    internalSteps = [originalSteps[originalStepIndex], internalSteps[currentStepIndex]];
    currentStepIndex = 1;
    await tick();
    await move(-1);
    disableTransitions = true;
    internalSteps = originalSteps;
    currentStepIndex = originalStepIndex;
    await tick();
    sidestepConfig = void 0;
    originalSteps = void 0;
    originalStepIndex = void 0;
    disableTransitions = false;
  } else {
    dispatch("conclusion");
  }
}
$: {
  currentStep;
  updateResizeObserver();
}
function emitStepChange(newIndex = currentStepIndex, of = resolvedSteps.length - 1, dir = direction) {
  dispatch("stepChange", { newIndex, of, direction: dir });
}
onMount(() => {
  const windowResizeListener = () => updateContainerHeight();
  window.addEventListener("resize", windowResizeListener);
  return () => window.removeEventListener("resize", windowResizeListener);
});
onDestroy(() => resizeObserver?.disconnect());
</script>

<div
  class="stepper-container"
  style:height={`${$containerHeight}px`}
  style:overflow={transitioning ? 'hidden' : 'visible'}
>
  {#key `${currentStepIndex}`}
    <div
      in:introTransition|local={introTransitionParams(direction)}
      out:outroTransition|local={outroTransitionParams(direction)}
      on:outrostart={() => setTransitioning(true)}
      on:introend={() => setTransitioning(false)}
      class="step-container"
    >
      <div class="step" bind:this={stepElement} style:padding>
        <svelte:component
          this={currentStep.component}
          on:goForward={handleGoForward}
          on:goBackward={handleGoBackward}
          on:sidestep={handleSidestep}
          on:cancelSidestep={handleCancelSidestep}
          {currentStepIndex}
          {...currentStep.props}
          context={resolvedContext}
        />
      </div>
    </div>
  {/key}
</div>

<style>
  .stepper-container {
    position: relative;
  }

  .step-container {
    position: absolute;
    width: 100%;
  }

  @media only screen and (max-width: 54rem) {
    .step {
      padding: 1rem;
    }
  }
</style>
