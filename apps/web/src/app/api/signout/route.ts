import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const DELETE = async () => {
    await CrepenCookieOperationService.insertTokenData();
    return NextResponse.json({ success: true });
}