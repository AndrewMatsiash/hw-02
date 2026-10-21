// This file runs before the application modules are imported.
process.env.ADMIN_USERNAME ??= "admin";
process.env.ADMIN_PASSWORD ??= "qwerty";
process.env.DB_URL ??= "mongodb://127.0.0.1:27017";
process.env.DB_NAME ??= "ed-back-lessons-uber-test";
