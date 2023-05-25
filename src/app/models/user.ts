export class User{
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public address: string;
    public password: string;
    public id: string;
    public cnp: number;
    public birthdate: Date;
    public role: string;
    public createdDate: Date;
    
    constructor(init: Partial<User>) {
        Object.assign(this, init);
    }
}