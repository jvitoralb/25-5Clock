import { TimeLength, Timer } from './classes.js'

const sessionBreak = document.querySelectorAll('.session-break')
const sessionLength = document.querySelector('#session-length')!
const breakLength = document.querySelector('#break-length')!
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

enum Status {
    NotStarted,
    InProgress
}

const SESSION: TimerType = 'session'
const BREAK: TimerType = 'break'
const DISABLE: Effects = 'disable'
const HIDE: Effects = 'hide'
let inTimerID: SetTimeID = undefined
let outTimerID: SetTimeID = undefined
let sessionTime: TimeLength
let breakTime: TimeLength
let timer: Timer
let minutes: number
let seconds: number = 0

interface BreakSessionInter {
    session: Function
    break: Function
}

const ctrlBreakSession: BreakSessionInter = {
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

interface TimerStatusInter {
    timerType: Function,
    status: Status
}

const timerStatus: TimerStatusInter = {
    timerType: (): TimerType => timer.getType(),
    status: Status.NotStarted
}

const handleTimerLength = (option: string): void => {
    /**
     * If timer is running then is paused, you can change session and/or break length, which is not ideal
     * Deal with it, block it
    **/

    if (option.includes(SESSION)) {
        ctrlBreakSession[SESSION](option, sessionTime)
        sessionTime.render(SESSION)
    } else if (option.includes(BREAK)) {
        ctrlBreakSession[BREAK](option, breakTime)
        breakTime.render(BREAK)
    }
    minutes = timer.setTimer()
    timer.render()
}

const handleChanges = (option: string): void => {
    if (timerStatus.status === 1) {
        seconds = 0
    }
    /**
     * Set a warning(tooltips or something) so the user knows it's gonna restart the timer
     * with the new time provided and call handleTimerLength
     * If timer is running then is paused and change break length the current:session time is re-rendered
    **/
    handleTimerLength(option)
}

sessionBreak.forEach(button => button.addEventListener('click', (): void => {
        let option: string = button.id
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
    console.log(`timer ${timer.getType()} ticking`, minutes, seconds)
    if (seconds === 0 && minutes >= 1) {
        minutes--
        seconds = 60
    }
    seconds--
    if (seconds === 0 && minutes === 0) {
        clearInterval(inTimerID)
        inTimerID = undefined
        timerEffects(DISABLE, 'on')
        handleAudio()
        outTimerID = setTimeout(() => {
        /**
         * This is not looking cool, perhaps switch this to a promise
        **/
            inTimerID = timer.switch()
            outTimerID = undefined
            minutes = timer.setTimer()
            btnEffects[DISABLE]('off')
            console.log(minutes, seconds, timer.setTimer())
        }, 2*1000)
    }
    timer.renderTimerOn(minutes, seconds)
}

const handleTimer = (): void => {

    if (!inTimerID && !outTimerID) {
        setTimeout(timerRunning, 200)
        inTimerID = setInterval(timerRunning, 1000)
        timerEffects(HIDE, 'on')
        timerStatus.status = Status.InProgress
    } else {
        clearInterval(inTimerID)
        inTimerID = undefined
        timerEffects(HIDE, 'off')
    }
}

startStop.addEventListener('click', handleTimer)

const loadValues = (): void => {
    sessionTime = new TimeLength(DefaultTimes.Session)
    breakTime = new TimeLength(DefaultTimes.Break)
    timer = new Timer(SESSION, sessionTime)
    minutes = timer.setTimer()
    sessionTime.render(SESSION)
    breakTime.render(BREAK)
    timer.render(true)
}

window.addEventListener('load', loadValues)

const resetTimer = (): void => {
    console.log('resetTimer called')
    seconds = 0
    loadValues()
    clearInterval(inTimerID)
    inTimerID = undefined
    clearTimeout(outTimerID)
    outTimerID = undefined
    handleAudio(true)
    timerEffects(HIDE, 'off', 'reset')
    timerStatus.status = Status.NotStarted
}

reset.addEventListener('click', resetTimer)

export {
    sessionLength, sessionTime, SESSION,
    breakLength, breakTime, BREAK, timerLabel,
    timeLeft, TimerType, NumOrStr, timerRunning
}

