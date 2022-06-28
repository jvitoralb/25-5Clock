import {
    sessionLength, sessionTime, SESSION,
    breakLength, breakTime, BREAK, timerLabel,
    timeLeft, TimerType, NumOrStr, timerRunning
} from './app.js'

export class TimeLength {
    private length: number

    constructor(length: number) {
        this.length = length
    }

    increment(): number {
        return this.length >= 60 ? this.length = 60 : this.length += 1
    }

    decrement(): number {
        return this.length <= 1 ? this.length = 1 : this.length -= 1
    }

    render(label: string): string {
        return label === 'session' ? sessionLength.textContent = `${this.length}` :
        breakLength.textContent = `${this.length}`
    }

    getLength(): number {
        return this.length
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

    setTimer(): number {
        if (this.type === SESSION) {
            this.duration = sessionTime
        } else  {
            this.duration = breakTime
        }
        return this.duration.getLength()
    }

    render(label?: boolean): string {
        if (label) {
            timerLabel.textContent = `${this.type[0].toUpperCase()}${this.type.slice(1)}`
        }

        return this.duration.getLength() < 10 ? timeLeft.textContent = `0${this.duration.getLength()}:00` :
        timeLeft.textContent = `${this.duration.getLength()}:00`
    }

    renderTimerOn(minutes: number, seconds: number): string {
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

    switch(): number {
        if (this.type === SESSION) {
            this.type = BREAK
        } else {
            this.type = SESSION
        }
        this.setTimer()
        this.render(true)
        return setInterval(timerRunning, 1000)
    }
}

