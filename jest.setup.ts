// settings/config.ts requires these at import time, so tests must not depend on a local .env
process.env.ADMIN_USERNAME ??= "admin";
process.env.ADMIN_PASSWORD ??= "qwerty";
