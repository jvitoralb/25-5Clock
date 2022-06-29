import { TimeLength, Timer } from './classes.js';
const sessionBreak = document.querySelectorAll('.session-break');
const sessionLength = document.querySelector('#session-length');
const breakLength = document.querySelector('#break-length');
const timerLabel = document.querySelector('#timer-label');
const startStop = document.querySelector('#start_stop');
const timeLeft = document.querySelector('#time-left');
const warningAudio = document.querySelector('#beep');
const reset = document.querySelector('#reset');
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
const ctrlBreakSession = {
    session: (type) => {
        console.log('session obj');
        if (type.includes('increment')) {
            sessionTime.increment();
        }
        else {
            sessionTime.decrement();
        }
        return sessionTime.render(SESSION);
    },
    break: (type) => {
        console.log('break obj');
        if (type.includes('increment')) {
            breakTime.increment();
        }
        else {
            breakTime.decrement();
        }
        return breakTime.render(BREAK);
    }
};
const timerStatus = {
    timerType: () => timer.getType(),
    status: Status.NotStarted
};
const handleTimerLength = (option) => {
    let sessionType = SESSION;
    if (option.includes(BREAK)) {
        sessionType = BREAK;
    }
    ctrlBreakSession[sessionType](option);
    minutes = timer.setTimer();
    timer.render();
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
    handleTimerLength(option);
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
        return ((call) => {
            sessionBreak.forEach(btn => {
                btn.classList.remove('visibilityClass');
            });
            return btnEffects[call]();
        })(DISABLE);
    }
    return btnEffects[effect](sousEffect);
};
const timerRunning = () => {
    console.log(`timer ${timerStatus.timerType()} ticking`, minutes, seconds);
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
            inTimerID = timer.switch();
            outTimerID = undefined;
            minutes = timer.setTimer();
            btnEffects[DISABLE]('off');
            console.log(minutes, seconds, timer.setTimer());
        }, 2 * 1000);
    }
    timer.renderTimerOn(minutes, seconds);
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
    minutes = timer.setTimer();
    sessionTime.render(SESSION);
    breakTime.render(BREAK);
    timer.render(true);
};
window.addEventListener('load', loadValues);
const resetTimer = () => {
    console.log('resetTimer called');
    seconds = 0;
    loadValues();
    clearInterval(inTimerID);
    inTimerID = undefined;
    clearTimeout(outTimerID);
    outTimerID = undefined;
    handleAudio(true);
    timerEffects(HIDE, 'off', 'reset');
    timerStatus.status = Status.NotStarted;
};
reset.addEventListener('click', resetTimer);
export { sessionLength, sessionTime, SESSION, breakLength, breakTime, BREAK, timerLabel, timeLeft, timerRunning };
