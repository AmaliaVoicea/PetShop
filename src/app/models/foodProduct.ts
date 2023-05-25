export class FoodProduct{
    public name: string;
    public price: number;
    public id: number;
    public description: string;
    public instructions: string;
    public category: string;
    public animal: Date;
    public age: string;
    public waist: string;

    constructor(init: Partial<FoodProduct>) {
        Object.assign(this, init);
    }
}
