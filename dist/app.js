import { TimeLength, Timer, Render } from './classes.js';
import { DefaultTimes, Status } from './types.js';
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
    status: Status.NotStarted,
    timerType: () => timer.getType(),
    timerDuration: () => timer.getDuration()
};
const changeTimerLength = (option) => {
    let sessionType = SESSION;
    if (option.includes(BREAK)) {
        sessionType = BREAK;
    }
    ctrlBreakSession[sessionType](option);
    minutes = timerStatus.timerDuration();
    return Render.timer();
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
const audioHandler = (stop) => {
    if (stop) {
        warningAudio.pause();
        return warningAudio.currentTime = 0;
    }
    return warningAudio.play();
};
const timerEffects = (effect, sousEffect, src) => {
    const btnEffects = {
        disable: (status) => {
            if (status === 'on') {
                return startStop.disabled = true;
            }
            return startStop.disabled = false;
        },
        hide: (status) => {
            return sessionBreak.forEach(btn => {
                if (status === 'on') {
                    return btn.classList.add('visibilityClass');
                }
                return btn.classList.remove('visibilityClass');
            });
        }
    };
    if (src === 'reset') {
        btnEffects[DISABLE]('off');
    }
    return btnEffects[effect](sousEffect);
};
const clearTimeIDs = (timeID) => {
    if (timeID === 'inTimerID') {
        clearInterval(inTimerID);
        return inTimerID = undefined;
    }
    clearTimeout(outTimerID);
    return outTimerID = undefined;
};
const timerRunning = () => {
    const switchSessions = () => {
        timer.switchType();
        minutes = timerStatus.timerDuration();
        inTimerID = setInterval(timerRunning, 1000);
        timerEffects(DISABLE, 'off');
        return clearTimeIDs('outTimerID');
    };
    if (seconds === 0 && minutes >= 1) {
        minutes--;
        seconds = 60;
    }
    seconds--;
    if (seconds === 0 && minutes === 0) {
        audioHandler(false);
        clearTimeIDs('inTimerID');
        timerEffects(DISABLE, 'on');
        outTimerID = setTimeout(switchSessions, 2 * 1000);
    }
    return Render.timerOn(minutes, seconds);
};
const handleTimer = () => {
    if (!inTimerID && !outTimerID) {
        setTimeout(timerRunning, 200);
        inTimerID = setInterval(timerRunning, 1000);
        timerEffects(HIDE, 'on');
        timerStatus.status = Status.InProgress;
    }
    else {
        clearTimeIDs('inTimerID');
        timerEffects(HIDE, 'off');
    }
};
startStop.addEventListener('click', handleTimer);
const loadValues = () => {
    sessionTime = new TimeLength(DefaultTimes.Session);
    breakTime = new TimeLength(DefaultTimes.Break);
    timer = new Timer(SESSION, sessionTime);
    minutes = timerStatus.timerDuration();
    return Render.onLoad();
};
window.addEventListener('load', loadValues);
const resetTimer = () => {
    clearTimeIDs('inTimerID');
    clearTimeIDs('outTimerID');
    seconds = 0;
    loadValues();
    audioHandler(true);
    timerEffects(HIDE, 'off', 'reset');
    timerStatus.status = Status.NotStarted;
};
reset.addEventListener('click', resetTimer);
export { BREAK, breakLength, breakTime, SESSION, sessionLength, sessionTime, timerStatus, timerLabel, timeLeft };
