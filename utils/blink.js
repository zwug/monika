export default function(times, duration, actionFunc) {
    let iterations = 0;

    const intervalId = setInterval(processTick, duration);

    function processTick() {
        if (iterations < times) {
            actionFunc();
            iterations++;
        } else {
            clearInterval(intervalId);
        }
    }
}