// This file runs before the application modules are imported.
process.env.ADMIN_USERNAME ??= "admin";
process.env.ADMIN_PASSWORD ??= "qwerty";
process.env.DB_NAME ??= "ed-back-lessons-uber-test";

if (!process.env.DB_URL) {
  throw new Error("Missing DB_URL in .env.test");
}
