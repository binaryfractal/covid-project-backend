// TODO: Enable commented code when token is enabled

import { Response } from "express";
import { 
    Controller, 
    Get, 
   // Body,
    Res, 
    HttpStatus, 
    Param,
    Post,
    Body
} from "@nestjs/common";
import { FindOneProfile } from "../../../application/usecases/profile/find-one-profile.usecase";
import { Profile } from "../../../domain/models/profile";
import { ProfileService } from "../../../infrastructure/services/profile/profile.service";
import { SaveProfile } from "../../../application/usecases/profile/save-profile.usecase";
//import { UserRecord } from "firebase-functions/lib/providers/auth";

@Controller("profiles")
export class ProfileController {
    private readonly findOneProfileUsecase: FindOneProfile<ProfileService>;
    private readonly saveProfileUsecase: SaveProfile<ProfileService>;

    constructor() {
        this.findOneProfileUsecase = new FindOneProfile(new ProfileService());
        this.saveProfileUsecase = new SaveProfile(new ProfileService());
    } 

    @Get(':uid')
    //@Get()
    //async findOne(@Body('user') user: UserRecord, @Res() res: Response): Promise<void> { 
    async findOne(@Param('uid') uid: string, @Res() res: Response): Promise<void> {
        try {
            // const profile: Profile = await this.findOneProfileUsecase.findOne(user.uid); 
            const profile: Profile = await this.findOneProfileUsecase.findOne(uid);
            res.status(HttpStatus.OK).send(profile);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }

    @Post(':uid')
    async save(@Param('uid') uid: string, @Body('profile') profile: Profile, @Res() res: Response): Promise<void> {
    //@Post()
    //async save(@Body('profile') profile: Profile, @Body('user') user: UserRecord, @Res() res: Response): Promise<void> {
        try {
            //profile.uid = user.uid;
            profile.uid = uid;
            await this.saveProfileUsecase.save(profile);
            res.status(HttpStatus.CREATED).send(true);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}