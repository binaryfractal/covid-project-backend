import { Base } from './base';
import { Survey } from './survey';

export interface Profile extends Base {
    uid: string;
    age: number;
    idCountry: string;
    country: string;
    email: string;
    firstUpdate: Date;
    gender: string;
    idRisk: string;
    risk: string;
    lastUpdate: Date;
    name: string;
    state: string;
    town: string;
    zip: string;
    surveys: Array<Survey>;
}