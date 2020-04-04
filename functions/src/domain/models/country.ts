import { Base } from "./base";

export interface Country extends Base {
    id: string;
    nameApi: string;
    name: string;
    confirmed: number;
    recovered: number;
    deaths: number;
    risk: number;
    riskFree: number;
    riskHigh: number;
    riskLow: number;
    total: number;
}