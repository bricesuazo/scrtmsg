/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("@/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    given_name: string;
    family_name: string;
    username: string | null;
    email?: string;
    id: string;
    emailVerified?: boolean;
  };
  type DatabaseSessionAttributes = {};
}
