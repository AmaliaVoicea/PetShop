export class AccessoryProduct{
    public product_title: string;
    public price: number;
    public id: number;
    public description: string;
    public instructions: string;
    public category: string;
    public animal: Date;
    public age: string;
    public waist: string;
    public color: string;
    public image_url: string;

    constructor(init: Partial<AccessoryProduct>) {
        Object.assign(this, init);
    }
}