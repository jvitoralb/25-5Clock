import { TimeLength } from './classes.js'

export const sessionLength = document.querySelector('#session-length')!
export const breakLength = document.querySelector('#break-length')!
const sessionBreak = document.querySelectorAll('.session-break')
const timerLabel = document.querySelector('#timer-label')!
const startStop = document.querySelector('#start_stop') as HTMLButtonElement
const timeLeft = document.querySelector('#time-left')!
const warningAudio = document.querySelector('#beep') as HTMLAudioElement
const reset = document.querySelector('#reset') as HTMLButtonElement

type TimerType = 'session' | 'break'
type Effects = 'disable' | 'hide'
type OnOff = 'on' | 'off'
type SetTimeID = number | undefined
type NumOrStr = number | string

enum DefaultTimes {
    Session = 25,
    Break = 5
}

const SESSION: TimerType = 'session'
const BREAK: TimerType = 'break'
const DISABLE: Effects = 'disable'
const HIDE: Effects = 'hide'
let sessionTime: TimeLength
let breakTime: TimeLength
let timer: Timer

let minutes: number
let seconds: number = 0
let inTimerID: SetTimeID = undefined
let outTimerID: SetTimeID = undefined

// Dont like this name 
interface BreakSessionInter {
    session: Function
    break: Function
}
// Also dont like this one
const functions: BreakSessionInter = { 
    session: (type: string, time: TimeLength): number => {
        if (type.includes('increment')) {
            return time.increment()
        }
        return time.decrement()
    },
    break: (type: string, time: TimeLength): number => {
        if (type.includes('increment')) {
            return time.increment()
        }
        return time.decrement()
    }
}

const handleChanges = (option: string): void => {
    /**
     * If timer is running then is paused, you can change session and/or break length, which is not ideal
     * Deal with it, block it
    **/

    if (option.includes(SESSION)) {
        functions[SESSION](option, sessionTime)
        sessionTime.render(SESSION)
    } else if (option.includes(BREAK)) {
        functions[BREAK](option, breakTime)
        breakTime.render(BREAK)
    }
    timer.render()
}

sessionBreak.forEach(button => button.addEventListener('click', (): void => {
        let option = button.id
        handleChanges(option)
    })
)

interface TimerEffectsInter {
    disable: Function
    hide: Function
}

const btnEffects: TimerEffectsInter = {
    disable: (status: OnOff): boolean => {
        if (status === 'on') {
            return startStop.disabled = true
        }
        return startStop.disabled = false
    },
    hide: (status: OnOff): void => {
        sessionBreak.forEach(btn => {
            if (status === 'on') {
                return btn.classList.add('visibilityClass')
            }
            return btn.classList.remove('visibilityClass')
        })
    }
}

class Timer {
    type: TimerType
    duration: TimeLength

    constructor(type: TimerType, dur: TimeLength) {
        this.type = type
        this.duration = dur
    }

    setTimer(): number {
        if (this.type === SESSION) {
            this.duration = sessionTime
        } else  {
            this.duration = breakTime
        }
        return minutes = this.duration.getLength()
    }

    render(label?: boolean): string {
        this.setTimer()
        if (label) {
            timerLabel.textContent = `${this.type[0].toUpperCase()}${this.type.slice(1)}`
        }
        return minutes < 10 ? timeLeft.textContent = `0${this.duration.getLength()}:00` :
        timeLeft.textContent = `${this.duration.getLength()}:00`
    }

    renderTimerOn(minutes: number, seconds: number): string {
        /**
         * Change this parameters and variables names
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

    stop(timerID: SetTimeID): void {
        // probably get rid of this method
        clearInterval(timerID)
    }

    switch(): number {
        if (this.type === SESSION) {
            this.type = BREAK
        } else {
            this.type = SESSION
        }
        this.render(true)
        outTimerID = undefined
        btnEffects[DISABLE]('off')
        return inTimerID = setInterval(timerRunning, 1000)
    }
}

const handleAudio = (stop?: boolean): void => {

    if (stop) {
        warningAudio.pause()
        warningAudio.currentTime = 0
    } else {
        warningAudio.play()
    }
}

const timerEffects = (effect: Effects, sousEffect?: OnOff, src?: string): Function => {
    if (src === 'reset') {
        return ((call: Effects) => {
            sessionBreak.forEach(btn => {
                btn.classList.remove('visibilityClass')
            })
            return btnEffects[call]()
        })(DISABLE)
    }
    return btnEffects[effect](sousEffect)
}

const timerRunning = (): void => {
    console.log(`timer ${timer.type} ticking`, minutes, seconds)
    if (seconds === 0 && minutes >= 1) {
        minutes--
        seconds = 60
    }
    seconds--
    if (seconds === 0 && minutes === 0) {
        timer.stop(inTimerID)
        inTimerID = undefined
        timerEffects(DISABLE, 'on')
        handleAudio()
        outTimerID = setTimeout(() => timer.switch(), 2*1000)
        // promise + timer.switch may help to change this class to another file
    }
    timer.renderTimerOn(minutes, seconds)
}

const handleTimer = (): void => {

    if (!inTimerID && !outTimerID) {
        setTimeout(timerRunning, 200)
        inTimerID = setInterval(timerRunning, 1000)
        timerEffects(HIDE, 'on')
    } else {
        timer.stop(inTimerID)
        inTimerID = undefined
        timerEffects(HIDE, 'off')
    }
}

startStop.addEventListener('click', handleTimer)

const loadValues = (): void => {
    breakTime = new TimeLength(DefaultTimes.Break)
    sessionTime = new TimeLength(DefaultTimes.Session)
    timer = new Timer(SESSION, sessionTime)
    sessionTime.render(SESSION)
    breakTime.render(BREAK)
    timer.render(true)
}

window.addEventListener('load', loadValues)

const resetTimer = (): void => {
    console.log('resetTimer called')
    loadValues()
    clearInterval(inTimerID)
    inTimerID = undefined
    clearTimeout(outTimerID)
    outTimerID = undefined
    handleAudio(true)
    timerEffects(HIDE, 'off', 'reset')
    minutes = DefaultTimes.Session
    seconds = 0
}

reset.addEventListener('click', resetTimer)

