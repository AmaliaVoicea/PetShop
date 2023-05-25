export class UserLoginResponse{
    public email: string;
    public cnp: number;
    public firstName: string;
    public lastName: string;
    public token: string;
    public address: string;
    public birthdate: Date;
    public phone: string;
    public role: string;
    public createdDate: Date;
    public id: string;

    constructor(init: Partial<UserLoginResponse>) {
        Object.assign(this, init);
    }
}