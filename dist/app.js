import { TimeLength, Timer, Render } from './classes.js';
const sessionBreak = document.querySelectorAll('.session-break');
const sessionLength = document.querySelector('#session-length');
const breakLength = document.querySelector('#break-length');
const timerLabel = document.querySelector('#timer-label');
const startStop = document.querySelector('#start_stop');
const timeLeft = document.querySelector('#time-left');
const warningAudio = document.querySelector('#beep');
const reset = document.querySelector('#reset');
const SESSION = 'session';
const BREAK = 'break';
const DISABLE = 'disable';
const HIDE = 'hide';
let inTimerID = undefined;
let outTimerID = undefined;
let sessionTime;
let breakTime;
let timer;
let minutes;
let seconds = 0;
var DefaultTimes;
(function (DefaultTimes) {
    DefaultTimes[DefaultTimes["Session"] = 25] = "Session";
    DefaultTimes[DefaultTimes["Break"] = 5] = "Break";
})(DefaultTimes || (DefaultTimes = {}));
var Status;
(function (Status) {
    Status[Status["NotStarted"] = 0] = "NotStarted";
    Status[Status["InProgress"] = 1] = "InProgress";
})(Status || (Status = {}));
const ctrlBreakSession = {
    session: (type) => {
        if (type.includes('increment')) {
            sessionTime.increment();
        }
        else {
            sessionTime.decrement();
        }
        return Render.session();
    },
    break: (type) => {
        if (type.includes('increment')) {
            breakTime.increment();
        }
        else {
            breakTime.decrement();
        }
        return Render.break();
    }
};
const timerStatus = {
    timerDuration: () => timer.getDuration(),
    timerType: () => timer.getType(),
    status: Status.NotStarted
};
const changeTimerLength = (option) => {
    let sessionType = SESSION;
    if (option.includes(BREAK)) {
        sessionType = BREAK;
    }
    ctrlBreakSession[sessionType](option);
    minutes = timerStatus.timerDuration();
    Render.timer();
};
const handleChanges = (option) => {
    if (timerStatus.status === 1) {
        if (option.includes(BREAK)) {
            return ctrlBreakSession[BREAK](option);
        }
        seconds = 0;
    }
    /**
     * Set a warning(tooltips or something) so the user knows it's gonna restart the timer
    **/
    changeTimerLength(option);
};
sessionBreak.forEach(button => button.addEventListener('click', () => {
    let option = button.id;
    handleChanges(option);
}));
const btnEffects = {
    disable: (status) => {
        if (status === 'on') {
            return startStop.disabled = true;
        }
        return startStop.disabled = false;
    },
    hide: (status) => {
        sessionBreak.forEach(btn => {
            // Check this loop cycles, if is running unecessary
            if (status === 'on') {
                return btn.classList.add('visibilityClass');
            }
            return btn.classList.remove('visibilityClass');
        });
    }
};
const handleAudio = (stop) => {
    if (stop) {
        warningAudio.pause();
        warningAudio.currentTime = 0;
    }
    else {
        warningAudio.play();
    }
};
const timerEffects = (effect, sousEffect, src) => {
    if (src === 'reset') {
        btnEffects[HIDE]();
        return btnEffects[DISABLE]();
    }
    return btnEffects[effect](sousEffect);
};
const timerRunning = () => {
    // I don't like the way this function is
    if (seconds === 0 && minutes >= 1) {
        minutes--;
        seconds = 60;
    }
    seconds--;
    if (seconds === 0 && minutes === 0) {
        clearInterval(inTimerID);
        inTimerID = undefined;
        timerEffects(DISABLE, 'on');
        handleAudio();
        outTimerID = setTimeout(() => {
            /**
             * This is not looking cool, perhaps switch this to a promise
            **/
            inTimerID = timer.switchType();
            outTimerID = undefined;
            minutes = timerStatus.timerDuration();
            btnEffects[DISABLE]('off');
        }, 2 * 1000);
    }
    Render.timerOn(minutes, seconds);
};
const handleTimer = () => {
    if (!inTimerID && !outTimerID) {
        setTimeout(timerRunning, 200);
        inTimerID = setInterval(timerRunning, 1000);
        timerEffects(HIDE, 'on');
        timerStatus.status = Status.InProgress;
    }
    else {
        clearInterval(inTimerID);
        inTimerID = undefined;
        timerEffects(HIDE, 'off');
    }
};
startStop.addEventListener('click', handleTimer);
const loadValues = () => {
    sessionTime = new TimeLength(DefaultTimes.Session);
    breakTime = new TimeLength(DefaultTimes.Break);
    timer = new Timer(SESSION, sessionTime);
    minutes = timerStatus.timerDuration();
    Render.onLoad();
};
window.addEventListener('load', loadValues);
const resetTimer = () => {
    // Also don't like this function
    clearInterval(inTimerID);
    inTimerID = undefined;
    clearTimeout(outTimerID);
    outTimerID = undefined;
    seconds = 0;
    loadValues();
    handleAudio(true);
    timerEffects(HIDE, 'off', 'reset');
    timerStatus.status = Status.NotStarted;
};
reset.addEventListener('click', resetTimer);
export { SESSION, sessionLength, sessionTime, BREAK, breakLength, breakTime, timer, timerLabel, timeLeft, timerRunning };
