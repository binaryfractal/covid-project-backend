export interface UpdateCasesPort {
    update(idCountry: string, idNewRisk: string, idOldRisk: string): Promise<void>;
}

export class UpdateCases<T extends UpdateCasesPort> {
    private readonly port: T;

    constructor(port: T) {
        this.port = port;
    }

    async update(idCountry: string, idNewRisk: string, idOldRisk: string): Promise<void> {
        await this.port.update(idCountry, idNewRisk, idOldRisk);
    }
}