import { 
    DocumentSnapshot, 
    Query, 
    QuerySnapshot, 
    Timestamp 
} from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { CONFIRMED } from "../../../config/global";
import { FindAllProfilesPort } from "../../../application/usecases/profile/find-all-profiles.usecase";
import { Filter } from "../../../domain/models/filter";
import { Profile } from "../../../domain/models/profile";

export class SearchService implements FindAllProfilesPort {

    async findAll(filters: Array<Filter>): Promise<Array<Profile>> {
        let result: Query = db.collection('profiles').where("idRisk", "==", CONFIRMED );

        for(let filter of filters) {
            if(filter.comparator === "==") 
                result = result.where(filter.name, "==", filter.value);
            else if(filter.comparator === "<=") 
                result = result.where(filter.name, "<=", filter.value);
            else if(filter.comparator === ">=")
                result = result.where(filter.name, ">=", filter.value);
            else if(filter.comparator === "<") 
                result = result.where(filter.name, "<", filter.value);
            else if(filter.comparator === ">")
                result = result.where(filter.name, ">", filter.value);
            else if(filter.comparator === "B") {
                result = result.where(filter.name, ">=", filter.values[0])
                    .where(filter.name, "<=", filter.values[1]);
            }
        }

        const querySnapshot: QuerySnapshot = await result.limit(100).get();
        const profiles: Array<Profile> = await this.fillAll(querySnapshot);
        return profiles;
    }

    private async fillAll(querySnapshot: QuerySnapshot): Promise<Array<Profile>> {
        const profiles: Array<Profile> = new Array<Profile>();
        if(!querySnapshot.empty) {
            let profile: Profile = {} as Profile;
            for(let snapshot of querySnapshot.docs) {
                profile = await this.fillOne(snapshot);
                profiles.push(profile);
            }
        }
        return profiles;
    }

    private async fillOne(snapshot: DocumentSnapshot): Promise<Profile> {
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
}