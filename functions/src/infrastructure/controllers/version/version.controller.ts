import { Response } from 'express';
import { 
    Controller, 
    Get, 
    Res, 
    HttpStatus 
} from "@nestjs/common";
import { FindLastVersion } from "../../../application/usecases/version/find-last-version.usecase";
import { VersionService } from "../../services/version/version.service";

@Controller("versions")
export class VersionController {
    private readonly findLastVersionUsecase:FindLastVersion<VersionService>;

    constructor() {
        this.findLastVersionUsecase = new FindLastVersion(new VersionService());
    }

    @Get()
    async findAll(@Res() res: Response): Promise<void> {
        try {
            const version: string = await this.findLastVersionUsecase.findLast();
            res.status(HttpStatus.OK).send(version);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}
  