export class Animal {
    public id: string;
    public name: string;
    public type: string;
    public description: string;
    public gender: string;
    public age: number;
    public vaccinated: boolean;
    public sterilised: boolean;
    public specialTreatment: boolean;
    public addedAt: Date;
    public orgId: string;

    constructor(init: Partial<Animal>) {
        Object.assign(this, init);
    }
}