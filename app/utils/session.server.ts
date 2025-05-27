import { createCookieSessionStorage } from "react-router";

type SessionData = {
  memberId: number;
};

type SessionFlashData = {
  error: string;
};

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "__session",

        // all of these are optional
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.SERVER_DOMAIN,
        // Expires can also be set (although maxAge overrides it when used in combination).
        // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
        //
        // expires: new Date(Date.now() + 60_000),
        httpOnly: true,
        maxAge: 3600,
        path: "/",
        sameSite: "strict",
        secrets: [process.env.SESSION_SECRET!],
        secure: true,
      },
    }
  );
