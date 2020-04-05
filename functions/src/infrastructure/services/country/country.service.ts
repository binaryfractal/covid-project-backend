import { DocumentSnapshot, QuerySnapshot } from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { Country } from "../../../domain/models/country";
import { FindAllCountriesPort } from "../../../application/usecases/countries/find-all-countries.usecase";
import { FindOneCountryPort } from "../../../application/usecases/countries/find-one-country.usecase";

export class CountryService implements FindOneCountryPort, FindAllCountriesPort {

    async findOne(id: string): Promise<Country> {
        const countrySnapshot: DocumentSnapshot =  
            await db.collection('countries').doc(id).get();

        const country: Country = await this.fillOne(countrySnapshot);
        return country;
    }

    async findAll(): Promise<Array<Country>> {
        const countriesQuerySnapshot: QuerySnapshot =
            await db.collection('countries').get();

        const countries: Array<Country> = await this.fillAll(countriesQuerySnapshot);
        return countries;
    }

    private async fillAll(querySnapshot: QuerySnapshot): Promise<Array<Country>> {
        const countries: Array<Country> = new Array<Country>();
        if(!querySnapshot.empty) {
            let country: Country = {} as Country;
            for(let snapshot of querySnapshot.docs) {
                country = await this.fillOne(snapshot);
                countries.push(country);
            }
        }
        return countries;
    }

    private async fillOne(snapshot: DocumentSnapshot): Promise<Country> {
        const country: Country = {} as Country;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                country.id = snapshot.id;
                country.name = snapshot.get('name');
                country.nameApi = snapshot.get('nameApi');
                country.confirmed = snapshot.get('confirmed');
                country.recovered = snapshot.get('recovered');
                country.deaths = snapshot.get('deaths');
                country.risk = snapshot.get('risk');
                country.riskFree = snapshot.get('riskFree');
                country.riskHigh = snapshot.get('riskHigh');
                country.riskLow = snapshot.get('riskLow');
                country.total = snapshot.get('total');
            }
        }
        return country;
    }
}