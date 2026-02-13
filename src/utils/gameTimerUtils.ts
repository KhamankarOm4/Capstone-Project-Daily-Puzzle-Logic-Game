export let _elapsedSeconds = 0;

export const setElapsedSeconds = (val: number) => {
    _elapsedSeconds = val;
};

export const getElapsedSeconds = () => _elapsedSeconds;
