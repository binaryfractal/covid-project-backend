import { 
    DocumentReference, 
    DocumentSnapshot, 
    WriteBatch 
} from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { UpdateCasesPort } from "../../../application/usecases/countries/update-cases.usecase";
import { 
    CONFIRMED, 
    RECOVERED, 
    RISK_FREE, 
    RISK_LOW, 
    RISK, 
    RISK_HIGH 
} from "../../../config/global";

export class CaseService implements UpdateCasesPort {
    async update(idCountry: string, idNewRisk: string, idOldRisk: string) {
        const batch: WriteBatch = db.batch();
        const countryReference: DocumentReference = db.collection('countries').doc(idCountry);
        const countrySnapshot: DocumentSnapshot = await countryReference.get();

        let confirmed: number = 0;
        let recovered: number = 0;
        let riskFree: number = 0;
        let riskLow: number = 0;
        let risk: number = 0;
        let riskHigh: number = 0; 

        if(countrySnapshot.exists) {
            if(countrySnapshot.data() !== undefined) {
                confirmed = countrySnapshot.get('confirmed');
                recovered = countrySnapshot.get('recovered');
                riskFree = countrySnapshot.get('riskFree');
                riskLow = countrySnapshot.get('riskLow');
                risk = countrySnapshot.get('risk');
                riskHigh = countrySnapshot.get('riskHigh');

                if(idOldRisk === CONFIRMED) {
                    confirmed -= 1;   
                    confirmed = confirmed > 0 ? confirmed : 0;
                } else if (idOldRisk === RECOVERED) {
                    recovered -= 1;
                    recovered = recovered > 0 ? recovered : 0;
                } else if (idOldRisk === RISK_FREE) {
                    riskFree -= 1;
                    riskFree = riskFree > 0 ? riskFree : 0;
                } else if (idOldRisk === RISK_LOW) {
                    riskLow -= 1;
                    riskLow = riskLow > 0 ? riskLow : 0;
                } else if (idOldRisk === RISK) {
                    risk -= 1;
                    risk = risk > 0 ? risk : 0;
                } else if (idOldRisk === RISK_HIGH) {
                    riskHigh -= 1;
                    riskHigh = riskHigh > 0 ? riskHigh : 0;
                }

                if(idNewRisk === CONFIRMED) {
                    confirmed += 1;    
                } else if (idNewRisk === RECOVERED) {
                    recovered += 1;
                } else if (idNewRisk === RISK_FREE) {
                    riskFree += 1;
                } else if (idNewRisk === RISK_LOW) {
                    riskLow += 1;
                } else if (idNewRisk === RISK) {
                    risk += 1;
                } else if (idNewRisk === RISK_HIGH) {
                    riskHigh += 1;
                }
        
                batch.update(db.collection('countries').doc(idCountry), {
                    confirmed: confirmed,
                    recovered: recovered,
                    riskFree: riskFree,
                    riskLow: riskLow,
                    risk: risk,
                    riskHigh: riskHigh
                });
            }
        }

        await batch.commit();
    }
}