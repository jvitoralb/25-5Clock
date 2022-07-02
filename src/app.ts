import { TimeLength, Timer, Render } from './classes.js'
import { DefaultTimes, Status, TimerType, Effects, OnOff, SetTimeID,
    BreakSessionInter, TimerEffectsInter, TimerStatusInter
} from './types.js'

const sessionBreak = document.querySelectorAll('.session-break')
const sessionLength = document.querySelector('#session-length')!
const breakLength = document.querySelector('#break-length')!
const timerLabel = document.querySelector('#timer-label')!
const startStop = document.querySelector('#start_stop') as HTMLButtonElement
const timeLeft = document.querySelector('#time-left')!
const warningAudio = document.querySelector('#beep') as HTMLAudioElement
const reset = document.querySelector('#reset') as HTMLButtonElement

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

const ctrlBreakSession: BreakSessionInter = {
    session: (type: string): string => {
        if (type.includes('increment')) {
            sessionTime.increment()
        } else {
            sessionTime.decrement()
        }
        return Render.session()
    },
    break: (type: string): string => {
        if (type.includes('increment')) {
            breakTime.increment()
        } else {
            breakTime.decrement()
        }
        return Render.break()
    }
}

const timerStatus: TimerStatusInter = {
    status: Status.NotStarted,
    timerType: (): TimerType => timer.getType(),
    timerDuration: (): number => timer.getDuration()
}

const changeTimerLength = (option: string): Render => {
    let sessionType: TimerType = SESSION

    if (option.includes(BREAK)) {
        sessionType = BREAK
    }
    ctrlBreakSession[sessionType](option)
    minutes = timerStatus.timerDuration()
    return Render.timer()
}

const handleChanges = (option: string): void => {
    if (timerStatus.status === 1) {
        if(option.includes(BREAK)) {
            return ctrlBreakSession[BREAK](option)
        }
        seconds = 0
    }
    /**
     * Set a warning(tooltips or something) so the user knows it's gonna restart the timer
    **/
    changeTimerLength(option)
}

sessionBreak.forEach(button => button.addEventListener('click', (): void => {
        let option: string = button.id
        handleChanges(option)
    })
)

const audioHandler = (stop: boolean) => {
    if (stop) {
        warningAudio.pause()
        return warningAudio.currentTime = 0
    }
    return warningAudio.play()
}

const timerEffects = (effect: Effects, sousEffect: OnOff, src?: string): Function => {

    const btnEffects: TimerEffectsInter = {
        disable: (status: OnOff): boolean => {
            if (status === 'on') {
                return startStop.disabled = true
            }
            return startStop.disabled = false
        },
        hide: (status: OnOff): void => {
            return sessionBreak.forEach(btn => {
                if (status === 'on') {
                    return btn.classList.add('visibilityClass')
                }
                return btn.classList.remove('visibilityClass')
            })
        }
    }

    if (src === 'reset') {
        btnEffects[DISABLE]('off')
    }

    return btnEffects[effect](sousEffect)
}

const clearTimeIDs = (timeID: string): SetTimeID => {
    if (timeID === 'inTimerID') {
        clearInterval(inTimerID)
        return inTimerID = undefined
    }
    clearTimeout(outTimerID)
    return outTimerID = undefined
}

const timerRunning = (): Render => {

    const switchSessions = (): SetTimeID => {
        timer.switchType()
        minutes = timerStatus.timerDuration()
        inTimerID = setInterval(timerRunning, 1000)
        timerEffects(DISABLE, 'off')
        return clearTimeIDs('outTimerID')
    }

    if (seconds === 0 && minutes >= 1) {
        minutes--
        seconds = 60
    }
    seconds--
    if (seconds === 0 && minutes === 0) {
        audioHandler(false)
        clearTimeIDs('inTimerID')
        timerEffects(DISABLE, 'on')
        outTimerID = setTimeout(switchSessions, 2*1000)
    }
    return Render.timerOn(minutes, seconds)
}

const handleTimer = (): void => {

    if (!inTimerID && !outTimerID) {
        setTimeout(timerRunning, 200)
        inTimerID = setInterval(timerRunning, 1000)
        timerEffects(HIDE, 'on')
        timerStatus.status = Status.InProgress
    } else {
        clearTimeIDs('inTimerID')
        timerEffects(HIDE, 'off')
    }
}

startStop.addEventListener('click', handleTimer)

const loadValues = (): Render => {
    sessionTime = new TimeLength(DefaultTimes.Session)
    breakTime = new TimeLength(DefaultTimes.Break)
    timer = new Timer(SESSION, sessionTime)
    minutes = timerStatus.timerDuration()
    return Render.onLoad()
}

window.addEventListener('load', loadValues)

const resetTimer = (): void => {
    clearTimeIDs('inTimerID')
    clearTimeIDs('outTimerID')
    seconds = 0
    loadValues()
    audioHandler(true)
    timerEffects(HIDE, 'off', 'reset')
    timerStatus.status = Status.NotStarted
}

reset.addEventListener('click', resetTimer)

export {
    BREAK, breakLength, breakTime,
    SESSION, sessionLength, sessionTime,
    timerStatus, timerLabel, timeLeft
}

