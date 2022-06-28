import { sessionLength, sessionTime, SESSION, breakLength, breakTime, BREAK, timerLabel, timeLeft, timerRunning } from './app.js';
export class TimeLength {
    constructor(length) {
        this.length = length;
    }
    increment() {
        return this.length >= 60 ? this.length = 60 : this.length += 1;
    }
    decrement() {
        return this.length <= 1 ? this.length = 1 : this.length -= 1;
    }
    render(label) {
        return label === 'session' ? sessionLength.textContent = `${this.length}` :
            breakLength.textContent = `${this.length}`;
    }
    getLength() {
        return this.length;
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
    setTimer() {
        if (this.type === SESSION) {
            this.duration = sessionTime;
        }
        else {
            this.duration = breakTime;
        }
        return this.duration.getLength();
    }
    render(label) {
        if (label) {
            timerLabel.textContent = `${this.type[0].toUpperCase()}${this.type.slice(1)}`;
        }
        return this.duration.getLength() < 10 ? timeLeft.textContent = `0${this.duration.getLength()}:00` :
            timeLeft.textContent = `${this.duration.getLength()}:00`;
    }
    renderTimerOn(minutes, seconds) {
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
    switch() {
        if (this.type === SESSION) {
            this.type = BREAK;
        }
        else {
            this.type = SESSION;
        }
        this.setTimer();
        this.render(true);
        return setInterval(timerRunning, 1000);
    }
}
