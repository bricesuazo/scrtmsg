/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("@/auth").Auth;
  type DatabaseUserAttributes = {
    username: string;
    email: string;
    emailVerified: number | null;
  };
  type DatabaseSessionAttributes = {};
}
