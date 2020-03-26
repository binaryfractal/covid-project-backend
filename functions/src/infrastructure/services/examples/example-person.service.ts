// This file is an example

import { 
    QuerySnapshot, 
    DocumentSnapshot, 
    WriteBatch
} from '@google-cloud/firestore';
import { db } from '../../../config/app';
import { FindOneExamplePersonPort } from '../../../application/usecases/examples/find-one-example-person.usecase';
import { FindAllExamplePeoplePort } from '../../../application/usecases/examples/find-all-example-people.usecase';
import { ExamplePerson } from '../../../domain/models/example-person';
import { SaveExamplePersonPort } from '../../../application/usecases/examples/save-example-person.usecase';

export class ExamplePersonService implements FindOneExamplePersonPort, FindAllExamplePeoplePort, SaveExamplePersonPort {

    async findOne(id: string): Promise<ExamplePerson> {
        const snapshot: DocumentSnapshot = await db.collection('example-people').doc(id).get()
        const person: ExamplePerson = await this.fillOne(snapshot);

        return person;
    }
    
    async findAll(): Promise<Array<ExamplePerson>> {
        const querySnapshot: QuerySnapshot = await db.collection('example-people').get();
        const people: Array<ExamplePerson> = await this.fillAll(querySnapshot);

        return people;
    }

    async save(person: ExamplePerson): Promise<void> {
        const batch: WriteBatch = db.batch();

        batch.create(db.collection('example-people').doc(person.id), {
            name: person.name,
            age: person.age
        });

        await batch.commit();
    }

    private async fillAll(querySnapshot: QuerySnapshot): Promise<Array<ExamplePerson>> {
        const people: Array<ExamplePerson> = new Array<ExamplePerson>();

        if(!querySnapshot.empty) {
            let person: ExamplePerson = {} as ExamplePerson;

            querySnapshot.forEach(async(snapshot) => {
                person = await this.fillOne(snapshot);
                people.push(person);
            });
        }

        return people;
    }

    private async fillOne(snapshot: DocumentSnapshot): Promise<ExamplePerson> {
        const person: ExamplePerson = {} as ExamplePerson;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                person.id = snapshot.id;
                person.name = snapshot.get('name');
                person.age = snapshot.get('age');
            }
        }

        return person;
    }
    
}