import type { RequestHandler } from "express";
import { SETTINGS } from "../../../settings/config";
import { parseBasicAuth } from "../../auth/parse-basic-auth";
import { verifyCredentials } from "../../auth/verify-credentials";
import { HTTP_STATUSES } from "../../http/http-statuses";

export const basicAuthGuard: RequestHandler = (req, res, next) => {
  const creds = parseBasicAuth(req.headers.authorization);

  if (!creds || !verifyCredentials(creds, SETTINGS.ADMIN)) {
    res.set("WWW-Authenticate", 'Basic realm="admin"');
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  next();
};
