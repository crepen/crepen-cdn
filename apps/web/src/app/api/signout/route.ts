import { AuthSessionProvider } from "@web/modules/server/service/AuthSessionProvider";
import { NextResponse } from "next/server";

export const DELETE = async () => {
    await (await AuthSessionProvider.instance()).reset();
    return NextResponse.json({ success: true });
}