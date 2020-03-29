import { Base } from "./base";

export interface Filter extends Base {
    name: string;
    comparator: string;
    value: string;
    values: Array<string>;
    limit: number;
}