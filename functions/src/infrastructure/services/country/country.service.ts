import { DocumentSnapshot } from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { Country } from "../../../domain/models/country";
import { Filter } from "../../../domain/models/filter";
import { FindOneCountryPort } from "../../../application/usecases/countries/find-one-country.usecase";
import { FindAllProfiles } from "../../../application/usecases/profile/find-all-profiles.usecase";
import { Profile } from "../../../domain/models/profile";
import { SearchService } from "../profile/search.service";

export class CountryService implements FindOneCountryPort {
    private findAllProfilesUsecase: FindAllProfiles<SearchService>;

    constructor() {
        this.findAllProfilesUsecase = new FindAllProfiles(new SearchService());
    }

    async findOne(id: string): Promise<Country> {
        const countrySnapshot: DocumentSnapshot =  
            await db.collection('countries').doc(id).get();

        const country: Country = await this.fillOne(countrySnapshot);
        return country;
    }

    private async fillOne(snapshot: DocumentSnapshot): Promise<Country> {
        const country: Country = {} as Country;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                country.id = snapshot.id;
                country.name = snapshot.get('name');
                country.confirmed = snapshot.get('confirmed');
                country.recovered = snapshot.get('recovered');
                country.risk = snapshot.get('risk');
                country.riskFree = snapshot.get('riskFree');
                country.riskHigh = snapshot.get('riskHigh');
                country.riskLow = snapshot.get('riskLow');
                country.total = snapshot.get('total');

                country.profilesLastConfirmed = await this.findAllLastConfirmed(snapshot.id);
            }
        }
        return country;
    }

    private async findAllLastConfirmed(id: string): Promise<Array<Profile>> {
        const filters: Array<Filter> = [ 
            {
                name: 'idCountry',
                comparator: '==',
                value: id,
                limit: 5
            } as Filter
        ];

        return this.findAllProfilesUsecase.findAll(filters)
    }
}