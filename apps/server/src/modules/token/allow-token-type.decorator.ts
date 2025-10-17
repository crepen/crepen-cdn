import { CrepenTokenType } from "@crepen-nest/interface/common-jwt";
import { AllowTokenTypeGuard } from "./allow-token-type.guard";
import { SetMetadata } from "@nestjs/common";

export const AllowTokenType = (...tokenTypes : CrepenTokenType[]) =>
     SetMetadata(
        AllowTokenTypeGuard.DECO_KEY, 
        tokenTypes
    );