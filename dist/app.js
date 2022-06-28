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
    session: (type, time) => {
        if (type.includes('increment')) {
            return time.increment();
        }
        return time.decrement();
    },
    break: (type, time) => {
        if (type.includes('increment')) {
            return time.increment();
        }
        return time.decrement();
    }
};
const timerStatus = {
    timerType: () => timer.getType(),
    status: Status.NotStarted
};
const handleTimerLength = (option) => {
    /**
     * If timer is running then is paused, you can change session and/or break length, which is not ideal
     * Deal with it, block it
    **/
    if (option.includes(SESSION)) {
        ctrlBreakSession[SESSION](option, sessionTime);
        sessionTime.render(SESSION);
    }
    else if (option.includes(BREAK)) {
        ctrlBreakSession[BREAK](option, breakTime);
        breakTime.render(BREAK);
    }
    timer.render(minutes);
    minutes = timer.setTimer();
};
const handleChanges = (option) => {
    if (timerStatus.status === 1) {
        seconds = 0;
    }
    /**
     * Set a warning(tooltips or something) so the user knows it's gonna restart the timer
     * with the new time provided and call handlechanges
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
    console.log(`timer ${timer.type} ticking`, minutes, seconds);
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
            inTimerID = timer.switch();
            outTimerID = undefined;
            minutes = timer.setTimer();
            btnEffects[DISABLE]('off');
            console.log(minutes, seconds, timer.setTimer());
        }, 2 * 1000);
        // promise + timer.switch may help to change this class to another file
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
    breakTime = new TimeLength(DefaultTimes.Break);
    sessionTime = new TimeLength(DefaultTimes.Session);
    timer = new Timer(SESSION, sessionTime);
    sessionTime.render(SESSION);
    breakTime.render(BREAK);
    minutes = DefaultTimes.Session;
    timer.render(minutes, true);
};
window.addEventListener('load', loadValues);
const resetTimer = () => {
    console.log('resetTimer called');
    loadValues();
    clearInterval(inTimerID);
    inTimerID = undefined;
    clearTimeout(outTimerID);
    outTimerID = undefined;
    timerStatus.status = Status.NotStarted;
    handleAudio(true);
    timerEffects(HIDE, 'off', 'reset');
    seconds = 0;
};
reset.addEventListener('click', resetTimer);
export { sessionLength, sessionTime, SESSION, breakLength, breakTime, BREAK, timerLabel, timeLeft, timerRunning, minutes };
