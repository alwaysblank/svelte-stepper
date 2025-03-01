export function makeStep(i) {
    return (cb) => cb(i);
}
