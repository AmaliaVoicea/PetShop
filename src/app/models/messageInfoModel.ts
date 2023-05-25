export class Messageinfo{
    public message: string;
    public name: string;
    public email: string;
    constructor(init: Partial<Messageinfo>) {
        Object.assign(this, init);
    }
}