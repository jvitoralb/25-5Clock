import { sessionLength, breakLength } from './app.js';
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
        return label === 'session' ? sessionLength.innerHTML = `${this.length}` :
            breakLength.innerHTML = `${this.length}`;
    }
    getLength() {
        return this.length;
    }
}
