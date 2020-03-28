import { 
    DocumentSnapshot, 
    Timestamp, 
    DocumentReference, 
    CollectionReference, 
    QuerySnapshot 
} from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { Answer } from "../../../domain/models/answer";
import { FindOneProfilePort } from "../../../application/usecases/profile/find-one-profile.usecase";
import { Profile } from "../../../domain/models/profile";
import { Question } from "../../../domain/models/question";
import { Survey } from "../../../domain/models/survey";

export class ProfileService implements FindOneProfilePort {
    private FREE: string = 'FREE';
    private UNIQUE: string = 'UNIQUE';
    private MULTIPLE: string = 'MULTIPLE';

    private profileReference: DocumentReference;
    private surveysReference: CollectionReference;
    private versionsReference: CollectionReference;
    private questionsReference: CollectionReference;
    private answersReference: CollectionReference;

    async findOne(uid: string): Promise<Profile> {
        this.profileReference = db.collection('profiles').doc(uid);

        const profileSnapshot: DocumentSnapshot = await this.profileReference.get();
        const profile: Profile = await this.fillBasicProfile(profileSnapshot);
        
        this.surveysReference = this.profileReference.collection('surveys');
        const surveysQuerySnapshot: QuerySnapshot = await this.surveysReference.get();

        profile.surveys = await this.fillAllSurveys(surveysQuerySnapshot)

        return profile;
    }

    private async fillBasicProfile(snapshot: DocumentSnapshot): Promise<Profile> {
        const profile: Profile = {} as Profile;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                profile.uid = snapshot.id;
                profile.age = snapshot.get('age');
                profile.country = snapshot.get('country');
                profile.email = snapshot.get('email');
                profile.firstUpdate = (<Timestamp>snapshot.get('firstUpdate')).toDate();
                profile.gender = snapshot.get('gender');
                profile.idCountry = snapshot.get('idCountry');
                profile.idRisk = snapshot.get('idRisk');
                profile.lastUpdate = (<Timestamp>snapshot.get('lastUpdate')).toDate();
                profile.name = snapshot.get('name');
                profile.risk = snapshot.get('risk');
                profile.state = snapshot.get('state');
                profile.town = snapshot.get('town');
                profile.zip = snapshot.get('zip');
            }
        }

        return profile;
    }

    private async fillAllSurveys(querySnapshot: QuerySnapshot): Promise<Array<Survey>> {
        const surveys: Array<Survey> = new Array<Survey>();

        if(!querySnapshot.empty) {
            let survey: Survey = {} as Survey;
            querySnapshot.forEach(async(snapshot) => {
                survey = await this.fillOneSurvey(snapshot);
                surveys.push(survey);
            });
        }

        return surveys;
    }

    private async fillOneSurvey(snapshot: DocumentSnapshot): Promise<Survey> {
        let survey: Survey = {} as Survey;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                this.versionsReference = this.surveysReference.doc(snapshot.id).collection('versions');
                const versionsQuerySnapshot: QuerySnapshot = 
                    await this.versionsReference.where("active", "==", true).get();
                
                const surveys: Array<Survey> = await this.fillAllVersions(versionsQuerySnapshot);
                
                if(surveys.length > 0)
                    survey = surveys[0];
            }
        }

        return survey;
    }

    private async fillAllVersions(querySnapshot: QuerySnapshot): Promise<Array<Survey>> {
        const surveys: Array<Survey> = new Array<Survey>();

        if(!querySnapshot.empty) {
            let survey: Survey = {} as Survey;
            querySnapshot.forEach(async(snapshot) => {
                survey = await this.fillOneVersion(snapshot);
                surveys.push(survey);
            });
        }

        return surveys;
    }

    private async fillOneVersion(snapshot: DocumentSnapshot): Promise<Survey> {
        const survey: Survey = {} as Survey;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                this.questionsReference = 
                    this.versionsReference.where("active", "==", true).firestore.collection('questions');

                survey.id = snapshot.id;
                survey.date = (<Timestamp>snapshot.get('date')).toDate();
                survey.name = snapshot.get('name');

                const questionsQuerySnapshot: QuerySnapshot = await this.questionsReference.get();
                survey.questions = await this.fillAllQuestions(questionsQuerySnapshot);
            }
        }

        return survey;
    }

    private async fillAllQuestions(querySnapshot: QuerySnapshot): Promise<Array<Question>> {
        const questions: Array<Question> = new Array<Question>();

        if(!querySnapshot.empty) {
            let question: Question = {} as Question;
            querySnapshot.forEach(async(snapshot) => {
                question = await this.fillOneQuestion(snapshot);
                questions.push(question);
            });
        }

        return questions;
    }

    private async fillOneQuestion(snapshot: DocumentSnapshot): Promise<Question> {
        const question: Question = {} as Question;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                question.id = snapshot.id;
                question.question = snapshot.get('question');
                question.order = snapshot.get('order');
                question.type = snapshot.get('type');
                
                if(question.type === this.FREE) {
                    question.answer = snapshot.get('answer');
                } else if(question.type === this.UNIQUE || question.type === this.MULTIPLE){
                    this.answersReference = this.questionsReference.doc(snapshot.id).collection('answers');
                    const answersQuerySnapshot: QuerySnapshot = await this.answersReference.get();
                    question.answers = await this.fillAllAnswers(answersQuerySnapshot);
                }
            }
        }

        return question;
    }

    private async fillAllAnswers(querySnapshot: QuerySnapshot): Promise<Array<Answer>> {
        const answers: Array<Answer> = new Array<Answer>();
        if(!querySnapshot.empty) {
            let answer: Answer = {} as Answer;
            querySnapshot.forEach(async(snapshot) => {
                answer = await this.fillOneAnswer(snapshot);
                answers.push(answer);
            });
        }

        return answers;
    }

    private async fillOneAnswer(snapshot: DocumentSnapshot): Promise<Answer> {
        const answer: Answer = {} as Answer;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                answer.id = snapshot.id;
                answer.answer = snapshot.get('answer');
            }
        }

        return answer;
    }
}