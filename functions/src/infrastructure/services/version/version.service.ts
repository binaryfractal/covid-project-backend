import { 
    QuerySnapshot, 
    DocumentSnapshot 
} from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { FindLastVersionPort } from "../../../application/usecases/version/find-last-version.usecase";

export class VersionService implements FindLastVersionPort {
    async findLast(): Promise<string> {
        const querySnapshot: QuerySnapshot = await db.collection('versions').get();
        let version: string = '1.0.0.0'; 

        if(!querySnapshot.empty) {
            const snapshot: DocumentSnapshot = querySnapshot.docs[0];
            version = snapshot.get('version'); 
        }

        return version;
    }
        
}
    