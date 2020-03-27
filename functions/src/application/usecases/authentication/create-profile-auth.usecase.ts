export interface CreateProfileAuthPort {
    createProfile(uid: string, email: string): Promise<void>;
}

export class CreateProfileAuth<T extends CreateProfileAuthPort> {
    private readonly port: T;

    constructor(port: T) {
        this.port = port;
    }

    async createProfile(uid: string, email: string): Promise<void> {
        await this.port.createProfile(uid, email);
    }
}