const clock = document.querySelector("#main-clock")!;

function doClock(now: number) {
  const currentTime = new Date(now);
  const currentTimeString = `${currentTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${currentTime.getSeconds().toString().padStart(2, "0")}`;
  clock.textContent = currentTimeString;
}

function oncePerSecond(callback: (now: number) => any) {
  const timerFunc = function () {
      // get the current time rounded down to a whole second (with a 10% margin)
      const now = 1000 * Math.floor(Date.now() / 1000 + 0.1);
      // run the callback
      callback(now);
      // wait for the next whole second
      setTimeout(timerFunc, now + 1000 - Date.now());
  };
  timerFunc();
}

oncePerSecond(doClock)

