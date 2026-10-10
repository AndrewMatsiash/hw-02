import { createHash, timingSafeEqual } from "node:crypto";
import { Credentials } from "./parse-basic-auth";

const hash = (value: string) => createHash("sha256").update(value).digest();

const safeEqual = (a: string, b: string): boolean =>
  timingSafeEqual(hash(a), hash(b));

export const verifyCredentials = (
  input: Credentials,
  expected: Credentials,
): boolean => {
  const usernameOk = safeEqual(input.username, expected.username);
  const passwordOk = safeEqual(input.password, expected.password);
  return usernameOk && passwordOk;
};
