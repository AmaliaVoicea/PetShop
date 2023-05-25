export class PasswordRequest {
    currentPassword: string;
    newPassword: string;

    constructor(p1: string, p2: string) {
        this.currentPassword = p1;
        this.newPassword = p2;
    }
}