export class Donation{
    public donationDate: Date;
    public amount: number;
    public userId: string;
    public ongId: string;

    constructor(init: Partial<Donation>) {
        Object.assign(this, init);
    }
}