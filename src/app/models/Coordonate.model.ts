export class Coordonate {
    public lat: number;
    public long: number;

    constructor(init: Partial<Coordonate>) {
        Object.assign(this, init);
    }
}