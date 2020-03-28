import { Base } from "./base";
import { Question } from "./question";

export interface Survey extends Base {
    id: string;
    name: string;
    date: Date;
    questions: Array<Question>;
}