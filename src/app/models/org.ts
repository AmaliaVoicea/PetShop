export class Org{
    public orgName: string;
    public address: string;
    public email: string;
    public phone: string;
    public id: string;
    public startDate: Date;
    public description: string;
    public password: string;
    public role: string;
    public payPalAccount: string;
    public createdDate: Date;

    constructor(init: Partial<Org>) {
        Object.assign(this, init);
    }
}