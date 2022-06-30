import { sessionLength, sessionTime, SESSION, breakLength, breakTime, BREAK, timerLabel, timeLeft, timerRunning, timer } from './app.js';
class Render {
    renderLabel() {
        return timerLabel.textContent = `${timer.getType()[0].toUpperCase()}${timer.getType().slice(1)}`;
    }
    timer() {
        return timer.getDuration() < 10 ? timeLeft.textContent = `0${timer.getDuration()}:00` :
            timeLeft.textContent = `${timer.getDuration()}:00`;
    }
    session() {
        return sessionLength.textContent = `${sessionTime.getLength()}`;
    }
    break() {
        return breakLength.textContent = `${breakTime.getLength()}`;
    }
    render(sessionType) {
        if (sessionType === BREAK) {
            return this.break();
        }
        else if (sessionType === SESSION) {
            return this.session();
        }
        return this.timer();
    }
}
export class TimeLength extends Render {
    constructor(length) {
        super(); // study more about this super thing
        this.length = length;
    }
    increment() {
        return this.length >= 60 ? this.length = 60 : this.length += 1;
    }
    decrement() {
        return this.length <= 1 ? this.length = 1 : this.length -= 1;
    }
    getLength() {
        return this.length;
    }
}
export class Timer extends Render {
    constructor(type, dur) {
        super(); // study more about this super thing
        this.type = type;
        this.duration = dur;
    }
    getType() {
        return this.type;
    }
    getDuration() {
        return this.duration.getLength();
    }
    setTimer() {
        /**
         * Don't think I need this here
         * You can just put this in switchType method
        **/
        if (this.type === SESSION) {
            return this.duration = sessionTime;
        }
        return this.duration = breakTime;
    }
    renderTimerOn(minutes, seconds) {
        /**
         * Work on tranfer this method to Render Class
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
    switchType() {
        if (this.type === SESSION) {
            this.type = BREAK;
        }
        else {
            this.type = SESSION;
        }
        this.renderLabel();
        this.setTimer();
        this.render();
        return setInterval(timerRunning, 1000);
    }
}
