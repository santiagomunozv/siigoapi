import { ProvisionsService } from "./provisions.service";
export declare class ProvisionsController {
    private readonly provisionsService;
    constructor(provisionsService: ProvisionsService);
    uploadProvisionsFile(file: Express.Multer.File): Promise<{
        message: string;
    }>;
}
