// schema.js
import { relations } from "drizzle-orm";
import { sqliteTable, text, blob, int, index } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  // email: text("email").notNull().unique(),
  // emailVerified: int("email_verified"),
  // other user attributes
});

export const userRelation = relations(user, ({ many }) => ({
  messages: many(message),
  replies: many(reply),
}));

export const session = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
});

export const sessionRelation = relations(session, ({ one }) => ({
  user: one(user),
}));

export const key = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  hashedPassword: text("hashed_password"),
});

export const keyRelation = relations(key, ({ one }) => ({
  user: one(user),
}));

export const message = sqliteTable(
  "message",
  {
    id: text("id").primaryKey(),
    message: text("message").notNull(),
    createdAt: blob("created_at", {
      mode: "bigint",
    }).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    codeName: text("code_name"),
  },
  (table) => {
    return {
      userId_idx: index("message_userId_idx").on(table.userId),
    };
  }
);

export const messageRelation = relations(message, ({ one, many }) => ({
  user: one(user),
  replies: many(reply),
}));

export const reply = sqliteTable(
  "reply",
  {
    id: text("id").primaryKey(),
    reply: text("reply").notNull(),
    createdAt: blob("created_at", {
      mode: "bigint",
    }).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    messageId: text("message_id")
      .notNull()
      .references(() => message.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      userId_idx: index("reply_userId_idx").on(table.userId),
      messageId_idx: index("reply_messageId_idx").on(table.messageId),
    };
  }
);

export const replyRelation = relations(reply, ({ one, many }) => ({
  user: one(user),
  message: one(message),
  replies: many(reply),
}));

// export const emailVerificationToken = sqliteTable("email_verification_token", {
//   id: text("id").primaryKey(),
//   userId: text("user_id")
//     .notNull()
//     .references(() => user.id),
//   expires: blob("expires", {
//     mode: "bigint",
//   }).notNull(),
// });

// export const passwordResetToken = sqliteTable("password_reset_token", {
//   id: text("id").primaryKey(),
//   userId: text("user_id")
//     .notNull()
//     .references(() => user.id),
//   expires: blob("expires", {
//     mode: "bigint",
//   }).notNull(),
// });
