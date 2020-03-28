import { FindOneProfilePort } from "../../../application/usecases/profile/find-one-profile.usecase";
import { Profile } from "../../../domain/models/profile";
import { db } from "config/app";
import { DocumentSnapshot, Timestamp } from "@google-cloud/firestore";

export class ProfileService implements FindOneProfilePort {
    async findOne(uid: string): Promise<Profile> {
        const snapshotProfile: DocumentSnapshot = await db.collection('profiles').doc(uid).get();
        const profile: Profile = await this.fillBasicProfile(snapshotProfile);

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
}