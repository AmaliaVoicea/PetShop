export class OrgLoginResponse {
    public email: string;
    public token: string;
    public address: string;
    public orgName: string;
    public phone: string;
    public startdate: Date;
    public description: string;
    public role: string;
    public payPalAccount: string;
    public createdDate: Date;
    public id: string;

    constructor(init: Partial<OrgLoginResponse>) {
        Object.assign(this, init);
    }
}