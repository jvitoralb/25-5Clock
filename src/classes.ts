import { TimerType, NumOrStr } from './types.js'
import {
    BREAK, breakLength, breakTime,
    SESSION, sessionLength, sessionTime,
    clockStatus, timerLabel, timeLeft
} from './app.js'

export class TimeLength {
    private length: number

    constructor(length: number) {
        this.length = length
    }

    getLength(): number {
        return this.length
    }

    increment(): number {
        return this.length >= 60 ? this.length = 60 : this.length += 1
    }

    decrement(): number {
        return this.length <= 1 ? this.length = 1 : this.length -= 1
    }
}

export class Render {

    static session(): string {
        return sessionLength.textContent = `${sessionTime.getLength()}`
    }

    static break(): string {
        return breakLength.textContent = `${breakTime.getLength()}`
    }

    static timerLabel(): string {
        return timerLabel.textContent = `${clockStatus.timerType()[0].toUpperCase()}${clockStatus.timerType().slice(1)}`
    }

    static timer(): string {
        return clockStatus.timerDuration() < 10 ? timeLeft.textContent = `0${clockStatus.timerDuration()}:00` :
        timeLeft.textContent = `${clockStatus.timerDuration()}:00`
    }

    static allValues(): string {
        this.timer()
        this.break()
        this.session()
        return this.timerLabel()
    }

    static timerOn(minutes: number, seconds: number): string {
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
}

export class Timer {
    private type: TimerType
    private duration: TimeLength

    constructor(type: TimerType, dur: TimeLength) {
        this.type = type
        this.duration = dur
    }

    getType(): TimerType {
        return this.type
    }

    getDuration(): number {
        return this.duration.getLength()
    }

    switchType(): Render {
        if (this.type === SESSION) {
            this.type = BREAK
            this.duration = breakTime
        } else {
            this.type = SESSION
            this.duration = sessionTime
        }
        Render.timerLabel()
        return Render.timer()
    }
}

