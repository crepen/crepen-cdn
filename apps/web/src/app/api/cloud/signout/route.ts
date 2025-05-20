import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const DELETE = async () => {
    const cookie = await cookies();
    if (cookie.has('crepen-tk')) {
        cookie.delete('crepen-tk');
    }

    if (cookie.has('crepen-tk-ex')) {
        cookie.delete('crepen-tk-ex');
    }

    if (cookie.has('crepen-usr')) {
        cookie.delete('crepen-usr');
    }

    return NextResponse.json({ success: true });
}