export class FarmacyProduct{
    public name: string;
    public price: number;
    public id: number;
    public description: string;
    public instructions: string;
    public category: string;
    public animal: Date;
    public age: string;

    constructor(init: Partial<FarmacyProduct>) {
        Object.assign(this, init);
    }
}
