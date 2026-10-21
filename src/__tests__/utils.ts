import request from "supertest";
import { HTTP_STATUSES } from "../core/http/http-statuses";
import { SETTINGS } from "../settings/config";
import { ROUTES } from "../shared/routes";
import { getTestApp } from "../testing/test-app";

export let api: ReturnType<typeof request>;

beforeAll(() => {
  api = request(getTestApp());
});

export const UNKNOWN_ID = "999";

export const basicAuth = (username: string, password: string) =>
  `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

export const withAuth = (
  test: request.Test,
  header = basicAuth(SETTINGS.ADMIN.username, SETTINGS.ADMIN.password),
) => test.set("Authorization", header);

export const BAD_AUTH_HEADERS: [string, string | undefined][] = [
  ["no header", undefined],
  ["wrong password", basicAuth(SETTINGS.ADMIN.username, "wrong")],
  ["wrong username", basicAuth("wrong", SETTINGS.ADMIN.password)],
  ["non-basic scheme", "Bearer some-token"],
  [
    "no colon in credentials",
    `Basic ${Buffer.from("admin").toString("base64")}`,
  ],
];

export const resetDb = () =>
  api
    .delete(`${ROUTES.base}${ROUTES.testing}/all-data`)
    .expect(HTTP_STATUSES.NO_CONTENT);

export const fieldErrors = (...fields: string[]) => ({
  errorsMessages: fields.map((field) => ({
    field,
    message: expect.any(String),
  })),
});
