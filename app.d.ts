/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("@/lib/auth").Auth;
  type DatabaseUserAttributes = {
    username: string;
  };
  type DatabaseSessionAttributes = {};
}
