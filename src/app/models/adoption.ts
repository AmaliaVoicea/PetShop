export class Adoption {
    public id: string;
    public statusRequest: string;
    public documentPath: string;
    public closedAt: Date;
    public animalId: string;
    public userId: string;

    constructor(init: Partial<Adoption>) {
        Object.assign(this, init);
    }
}