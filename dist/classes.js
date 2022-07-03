import { BREAK, breakLength, breakTime, SESSION, sessionLength, sessionTime, clockStatus, timerLabel, timeLeft } from './app.js';
export class TimeLength {
    constructor(length) {
        this.length = length;
    }
    getLength() {
        return this.length;
    }
    increment() {
        return this.length >= 60 ? this.length = 60 : this.length += 1;
    }
    decrement() {
        return this.length <= 1 ? this.length = 1 : this.length -= 1;
    }
}
export class Render {
    static session() {
        return sessionLength.textContent = `${sessionTime.getLength()}`;
    }
    static break() {
        return breakLength.textContent = `${breakTime.getLength()}`;
    }
    static timerLabel() {
        return timerLabel.textContent = `${clockStatus.timerType()[0].toUpperCase()}${clockStatus.timerType().slice(1)}`;
    }
    static timer() {
        return clockStatus.timerDuration() < 10 ? timeLeft.textContent = `0${clockStatus.timerDuration()}:00` :
            timeLeft.textContent = `${clockStatus.timerDuration()}:00`;
    }
    static allValues() {
        this.timer();
        this.break();
        this.session();
        return this.timerLabel();
    }
    static timerOn(minutes, seconds) {
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
}
export class Timer {
    constructor(type, dur) {
        this.type = type;
        this.duration = dur;
    }
    getType() {
        return this.type;
    }
    getDuration() {
        return this.duration.getLength();
    }
    switchType() {
        if (this.type === SESSION) {
            this.type = BREAK;
            this.duration = breakTime;
        }
        else {
            this.type = SESSION;
            this.duration = sessionTime;
        }
        Render.timerLabel();
        return Render.timer();
    }
}
