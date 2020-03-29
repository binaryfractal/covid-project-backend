import { 
    DocumentSnapshot, 
    QuerySnapshot 
} from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { Survey } from "../../../domain/models/survey";
import { Risk } from "../../../domain/models/risk";
import { Question } from "../../../domain/models/question";
import { Answer } from "../../../domain/models/answer";
import { 
    UNIQUE, 
    MULTIPLE 
} from "../../../config/global";

export class QualifierService {

    async rateSurveys(surveys: Array<Survey>): Promise<Risk> {
        let points: number = 0
        for(let survey of surveys) {
            points += await this.rateSurvey(survey);
        }

        if(points > 0)
            points = points / surveys.length;

        const risk: Risk = await this.calculateRisk(points);
        return risk;
    }

    private async rateSurvey(survey: Survey): Promise<number> {
        const surveySnapshot: DocumentSnapshot = 
            await db.collection('configs_risks').doc(survey.id).get();
        const points: number = await this.rateQuestions(survey.questions, surveySnapshot);
        return points;
    }

    private async rateQuestions(questions: Array<Question>, snapshot: DocumentSnapshot): Promise<number> {
        let points: number = 0;
        for(let question of questions) {
            if(question.type === UNIQUE || question.type === MULTIPLE) {
                const questionSnapshot: DocumentSnapshot = 
                    await snapshot.ref.collection('questions').doc(question.id).get();
                points += await this.rateAnswers(question.answers, questionSnapshot);
            }
        }
        return points;
    }

    private async rateAnswers(answers: Array<Answer>, snapshot: DocumentSnapshot): Promise<number> {
        let points: number = 0;
        for(let answer of answers) {
            const answerSnapShot: DocumentSnapshot =
                await snapshot.ref.collection('answers').doc(answer.id).get();   
            points += await this.rateAnswer(answerSnapShot);
        }
        return points;
    }

    private async rateAnswer(snapshot: DocumentSnapshot): Promise<number> {
        let points: number = 0;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                points = snapshot.get('points');
            }
        }
        return points;
    }

    private async calculateRisk(points: number): Promise<Risk> {
        const risk: Risk = {} as Risk;
        const querySnapshot:QuerySnapshot = await db.collection('risks').get();
        
        if(!querySnapshot.empty) {
            for(let snapshot of querySnapshot.docs) {
                const minRange: number = snapshot.get('minRange');
                const maxRange: number = snapshot.get('maxRange');

                if(points >= minRange && points <= maxRange) {
                    risk.id = snapshot.id;
                    risk.name = snapshot.get('name');
                    risk.minRange = snapshot.get('minRange');
                    risk.maxRange = snapshot.get('maxRange');
                    risk.message = snapshot.get('message');
                    break;
                }
            }
        }
        return risk;
    }
}