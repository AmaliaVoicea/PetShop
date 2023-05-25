export class Feedback {
    public rating: number;
    public comment: string;
    public addedAt: Date;
    public userId: string;
    public orgId: string;

    constructor(init: Partial<Feedback>) {
        Object.assign(this, init);
    }
}