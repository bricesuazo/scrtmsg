// import { db } from "@/db";
// import { emailVerificationToken, passwordResetToken } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { generateRandomString, isWithinExpiration } from "lucia/utils";

// const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

// export const generateEmailVerificationToken = async (userId: string) => {
//   const storedUserTokens = await db.query.emailVerificationToken.findMany({
//     where: (token, { eq }) => eq(token.userId, userId),
//   });
//   if (storedUserTokens.length > 0) {
//     const reusableStoredToken = storedUserTokens.find((token) => {
//       // check if expiration is within 1 hour
//       // and reuse the token if true
//       return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
//     });
//     if (reusableStoredToken) return reusableStoredToken.id;
//   }
//   const token = generateRandomString(63);

//   await db.insert(emailVerificationToken).values({
//     id: token,
//     expires: BigInt(new Date().getTime() + EXPIRES_IN),
//     userId,
//   });
//   return token;
// };

// export const validateEmailVerificationToken = async (token: string) => {
//   const storedToken = await db.transaction(async (trx) => {
//     const storedToken = await trx.query.emailVerificationToken.findFirst({
//       where: (tokens, { eq }) => eq(tokens.id, token),
//     });
//     if (!storedToken) throw new Error("Invalid token");
//     await trx
//       .delete(emailVerificationToken)
//       .where(eq(emailVerificationToken.userId, storedToken.userId));
//     return storedToken;
//   });
//   const tokenExpires = Number(storedToken.expires); // bigint => number conversion
//   if (!isWithinExpiration(tokenExpires)) {
//     throw new Error("Expired token");
//   }
//   return storedToken.userId;
// };

// export const generatePasswordResetToken = async (userId: string) => {
//   const storedUserTokens = await db.query.passwordResetToken.findMany({
//     where: (token, { eq }) => eq(token.userId, userId),
//   });
//   if (storedUserTokens.length > 0) {
//     const reusableStoredToken = storedUserTokens.find((token) => {
//       // check if expiration is within 1 hour
//       // and reuse the token if true
//       return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
//     });
//     if (reusableStoredToken) return reusableStoredToken.id;
//   }
//   const token = generateRandomString(63);
//   await db.insert(passwordResetToken).values({
//     id: token,
//     expires: BigInt(new Date().getTime() + EXPIRES_IN),
//     userId,
//   });

//   return token;
// };

// export const validatePasswordResetToken = async (token: string) => {
//   const storedToken = await db.transaction(async (trx) => {
//     const storedToken = await trx.query.passwordResetToken.findFirst({
//       where: (tokens, { eq }) => eq(tokens.id, token),
//     });
//     if (!storedToken) throw new Error("Invalid token");
//     await trx
//       .delete(passwordResetToken)
//       .where(eq(passwordResetToken.userId, storedToken.userId));
//     return storedToken;
//   });
//   const tokenExpires = Number(storedToken.expires); // bigint => number conversion
//   if (!isWithinExpiration(tokenExpires)) {
//     throw new Error("Expired token");
//   }
//   return storedToken.userId;
// };

// export const isValidPasswordResetToken = async (token: string) => {
//   const storedToken = await db.query.passwordResetToken.findFirst({
//     where: (tokens, { eq }) => eq(tokens.id, token),
//   });
//   if (!storedToken) return false;
//   const tokenExpires = Number(storedToken.expires); // bigint => number conversion
//   if (!isWithinExpiration(tokenExpires)) {
//     return false;
//   }
//   return true;
// };
