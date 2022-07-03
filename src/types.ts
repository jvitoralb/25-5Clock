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

interface BreakSessionInter {
    session: Function
    break: Function
}

interface TimerEffectsInter {
    disable: Function
    hide: Function
}

interface ClockStatusInter {
    status: Status,
    timerType: Function,
    timerDuration: Function
}

export {
    DefaultTimes, Status,
    TimerType, Effects, OnOff, SetTimeID, NumOrStr,
    BreakSessionInter, TimerEffectsInter, ClockStatusInter
}