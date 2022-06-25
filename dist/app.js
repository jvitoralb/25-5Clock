import { TimeLength } from './classes.js';
export const sessionLength = document.querySelector('#session-length');
export const breakLength = document.querySelector('#break-length');
const sessionBreak = document.querySelectorAll('.session-break');
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
const SESSION = 'session';
const BREAK = 'break';
let sessionTime;
let breakTime;
let timer;
let minutes;
let seconds = 0;
let inTimerID = undefined;
let outTimerID = undefined;
// Also dont like this one
const functions = {
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
const handleChanges = (option) => {
    /**
     * If timer is running then is paused, you can change session and/or break length, which is not ideal
     * Deal with it, block it
    **/
    if (option.includes(SESSION)) {
        functions[SESSION](option, sessionTime);
        sessionTime.render(SESSION);
    }
    else if (option.includes(BREAK)) {
        functions[BREAK](option, breakTime);
        breakTime.render(BREAK);
    }
    timer.render();
};
sessionBreak.forEach(button => button.addEventListener('click', () => {
    let option = button.id;
    handleChanges(option);
}));
const HIDE = 'hide';
const DISABLE = 'disable';
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
class Timer {
    constructor(type, dur) {
        this.type = type;
        this.duration = dur;
    }
    setTimer() {
        if (this.type === SESSION) {
            this.duration = sessionTime;
        }
        else {
            this.duration = breakTime;
        }
        return minutes = this.duration.getLength();
    }
    render(label) {
        this.setTimer();
        if (label) {
            timerLabel.textContent = `${this.type[0].toUpperCase()}${this.type.slice(1)}`;
        }
        return minutes < 10 ? timeLeft.textContent = `0${this.duration.getLength()}:00` :
            timeLeft.textContent = `${this.duration.getLength()}:00`;
    }
    renderTimerOn(minutes, seconds) {
        /**
         * Change this parameters and variables names
        **/
        let min = minutes;
        let sec = seconds;
        if (seconds < 10) {
            sec = `0${seconds}`;
        }
        if (minutes < 10) {
            min = `0${minutes}`;
        }
        return timeLeft.textContent = `${min}:${sec}`;
    }
    stop(timerID) {
        // probably get rid of this method
        clearInterval(timerID);
    }
    switch() {
        if (this.type === SESSION) {
            this.type = BREAK;
        }
        else {
            this.type = SESSION;
        }
        this.render(true);
        outTimerID = undefined;
        btnEffects[DISABLE]('off');
        return inTimerID = setInterval(timerRunning, 1000);
    }
}
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
        timer.stop(inTimerID);
        inTimerID = undefined;
        timerEffects(DISABLE, 'on');
        handleAudio();
        outTimerID = setTimeout(() => timer.switch(), 2 * 1000);
        // promise + timer.switch may help to change this class to another file
    }
    timer.renderTimerOn(minutes, seconds);
};
const handleTimer = () => {
    if (!inTimerID && !outTimerID) {
        setTimeout(timerRunning, 200);
        inTimerID = setInterval(timerRunning, 1000);
        timerEffects(HIDE, 'on');
    }
    else {
        timer.stop(inTimerID);
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
    timer.render(true);
};
window.addEventListener('load', loadValues);
const resetTimer = () => {
    console.log('resetTimer called');
    loadValues();
    clearInterval(inTimerID);
    inTimerID = undefined;
    clearTimeout(outTimerID);
    outTimerID = undefined;
    handleAudio(true);
    timerEffects(HIDE, 'off', 'reset');
    minutes = DefaultTimes.Session;
    seconds = 0;
};
reset.addEventListener('click', resetTimer);
