import {
    sessionLength, sessionTime, SESSION,
    breakLength, breakTime, BREAK, timerLabel,
    timeLeft, TimerType, NumOrStr, timerRunning, timer
} from './app.js'

class Render {
    public renderLabel(): string {
        return timerLabel.textContent = `${timer.getType()[0].toUpperCase()}${timer.getType().slice(1)}`
    }

    private timer(): string {
        return timer.getDuration() < 10 ? timeLeft.textContent = `0${timer.getDuration()}:00` :
        timeLeft.textContent = `${timer.getDuration()}:00`
    }

    private session(): string {
        return sessionLength.textContent = `${sessionTime.getLength()}`
    }

    private break(): string {
        return breakLength.textContent = `${breakTime.getLength()}`
    }

    public render(sessionType?: TimerType): string {
        if (sessionType === BREAK) {
            return this.break()
        } else if (sessionType === SESSION) {
            return this.session()
        }
        return this.timer()
    }
}

export class TimeLength extends Render {
    private length: number

    constructor(length: number) {
        super() // study more about this super thing
        this.length = length
    }

    increment(): number {
        return this.length >= 60 ? this.length = 60 : this.length += 1
    }

    decrement(): number {
        return this.length <= 1 ? this.length = 1 : this.length -= 1
    }

    getLength(): number {
        return this.length
    }
}

export class Timer extends Render {
    private type: TimerType
    private duration: TimeLength

    constructor(type: TimerType, dur: TimeLength) {
        super() // study more about this super thing
        this.type = type
        this.duration = dur
    }

    getType(): TimerType {
        return this.type
    }

    getDuration(): number {
        return this.duration.getLength()
    }

    setTimer(): TimeLength {
        /**
         * Don't think I need this here
         * You can just put this in switchType method
        **/
        if (this.type === SESSION) {
            return this.duration = sessionTime
        }
        return this.duration = breakTime
    }

    renderTimerOn(minutes: number, seconds: number): string {
        /**
         * Work on tranfer this method to Render Class
        **/
        let min: NumOrStr = minutes
        let sec: NumOrStr = seconds
        if (seconds < 10) {
            sec = `0${seconds}`
        }
        if (minutes < 10) {
            min = `0${minutes}`
        }
        return timeLeft.textContent = `${min}:${sec}`
    }

    switchType(): number {
        if (this.type === SESSION) {
            this.type = BREAK
        } else {
            this.type = SESSION
        }
        this.renderLabel()
        this.setTimer()
        this.render()
        return setInterval(timerRunning, 1000)
    }
}

