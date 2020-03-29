import * as bodyParser from 'body-parser';

import { 
    Module, 
    MiddlewareConsumer, 
    RequestMethod 
} from '@nestjs/common';
import { AuthenticationMiddleware } from '../infrastructure/middlewares/authentication.middleware';
import { ApplicationModule } from '../application/application.module';
import { DomainModule } from '../domain/domain.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

import cors from 'cors';

@Module({
    imports: [
      DomainModule,
      ApplicationModule,
      InfrastructureModule
    ]
})
export class AppModule {
    async configure(consumer: MiddlewareConsumer) : Promise<void> {
        const corsHandler = cors({origin: true});
        const urlEncodedParser = bodyParser.urlencoded({extended: false});
    
        consumer
          .apply(corsHandler)
          .forRoutes({ path: '*', method: RequestMethod.ALL });
    
        consumer
            .apply(urlEncodedParser)
            .forRoutes({ path: '*', method: RequestMethod.ALL });

        
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes({ path: 'example-people', method: RequestMethod.ALL }, 'example-people/(.*)');   
        
    }
}