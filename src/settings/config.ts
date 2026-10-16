const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
};

export const SETTINGS = {
  PORT: Number(process.env.PORT ?? 5001),
  ADMIN: {
    username: required("ADMIN_USERNAME"),
    password: required("ADMIN_PASSWORD"),
  },
  DB_NAME: process.env.DB_NAME || "ed-back-lessons-uber",
  DB_URL: required("DB_URL"),
} as const;
