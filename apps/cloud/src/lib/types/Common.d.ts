import { RequestCookies, ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export type Cookies = ResponseCookies | RequestCookies | ReadonlyRequestCookies;