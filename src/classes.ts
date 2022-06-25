import { sessionLength, breakLength } from './app.js'

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
        return label === 'session' ? sessionLength.innerHTML = `${this.length}` :
        breakLength.innerHTML = `${this.length}`
    }

    getLength(): number {
        return this.length
    }
}

