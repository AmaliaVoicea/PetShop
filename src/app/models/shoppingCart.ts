export class ShoppingCart{
    public name: string;
    public price: number;
    public id: number;
    public description: string;
    public instructions: string;
    public category: string;
    public animal: Date;
    public age: string;
    public image_url: string;

    constructor(init: Partial<ShoppingCart>) {
        Object.assign(this, init);
    }
}