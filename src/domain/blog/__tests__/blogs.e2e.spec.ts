import { HTTP_STATUSES } from "../../../core/http/http-statuses";
import {
  api,
  BAD_AUTH_HEADERS,
  fieldErrors,
  resetDb,
  UNKNOWN_ID,
  withAuth,
} from "../../../__tests__/utils";
import { BlogInputModel } from "../dto/blog.input.dto";
import { BlogViewModel } from "../types/blog.types";
import {
  BLOGS_URL,
  blogUrl,
  createBlog,
  validBlogInput as validInput,
} from "./blog.helpers";

const otherInput: BlogInputModel = {
  name: "SQL Explained",
  description: "Indexes and transactions",
  websiteUrl: "https://sql-explained.com/blog",
};

const updateBlog = (id: string, input: object) =>
  withAuth(api.put(blogUrl(id))).send(input);
const getBlogs = async (): Promise<BlogViewModel[]> =>
  (await api.get(BLOGS_URL)).body;

const INVALID_INPUTS: [keyof BlogInputModel, unknown][] = [
  ["name", undefined],
  ["name", 123],
  ["name", ""],
  ["name", "   "],
  ["name", "a".repeat(16)],
  ["description", undefined],
  ["description", ""],
  ["description", "a".repeat(501)],
  ["websiteUrl", undefined],
  ["websiteUrl", "http://node-internals.dev"],
  ["websiteUrl", "https://node internals.dev"],
  ["websiteUrl", `https://${"a".repeat(100)}.dev`],
];

describe("/blogs", () => {
  let blog: BlogViewModel;

  beforeEach(async () => {
    await resetDb();
    blog = (await createBlog().expect(HTTP_STATUSES.CREATED)).body;
  });

  describe("GET /blogs", () => {
    it("returns 200 and an empty array after reset", async () => {
      await resetDb();
      await api.get(BLOGS_URL).expect(HTTP_STATUSES.OK, []);
    });

    it("returns all blogs", async () => {
      const other = (await createBlog(otherInput)).body;
      expect(await getBlogs()).toEqual([blog, other]);
    });
  });

  describe("GET /blogs/:id", () => {
    it("returns 200 and the blog", async () => {
      await api.get(blogUrl(blog.id)).expect(HTTP_STATUSES.OK, blog);
    });

    it("returns 404 for an unknown id", async () => {
      await api.get(blogUrl(UNKNOWN_ID)).expect(HTTP_STATUSES.NOT_FOUND);
    });
  });

  describe("POST /blogs", () => {
    it("returns 201 and the created blog with a string id", () => {
      expect(blog).toEqual({ id: expect.any(String), ...validInput });
    });

    it("assigns unique ids", async () => {
      const other = (await createBlog(otherInput)).body;
      expect(other.id).not.toBe(blog.id);
    });

    it("trims string fields", async () => {
      const res = await createBlog({ ...otherInput, name: "  Trimmed  " });
      expect(res.body.name).toBe("Trimmed");
    });

    it("ignores client id and unknown fields", async () => {
      const res = await createBlog({
        ...otherInput,
        id: blog.id,
        extra: true,
      } as BlogInputModel);
      expect(res.body).toEqual({ id: expect.any(String), ...otherInput });
      expect(res.body.id).not.toBe(blog.id);
    });
  });

  describe("PUT /blogs/:id", () => {
    it("returns 204 and updates the blog", async () => {
      await updateBlog(blog.id, otherInput).expect(HTTP_STATUSES.NO_CONTENT);
      await api
        .get(blogUrl(blog.id))
        .expect(HTTP_STATUSES.OK, { id: blog.id, ...otherInput });
    });

    it("ignores client id and unknown fields", async () => {
      await updateBlog(blog.id, { ...otherInput, id: UNKNOWN_ID, extra: true });
      expect(await getBlogs()).toEqual([{ id: blog.id, ...otherInput }]);
    });

    it("returns 404 for an unknown id", async () => {
      await updateBlog(UNKNOWN_ID, otherInput).expect(HTTP_STATUSES.NOT_FOUND);
    });
  });

  describe("DELETE /blogs/:id", () => {
    it("returns 204 and removes the blog", async () => {
      await withAuth(api.delete(blogUrl(blog.id))).expect(
        HTTP_STATUSES.NO_CONTENT,
      );
      await api.get(blogUrl(blog.id)).expect(HTTP_STATUSES.NOT_FOUND);
    });

    it("returns 404 for an unknown id", async () => {
      await withAuth(api.delete(blogUrl(UNKNOWN_ID))).expect(
        HTTP_STATUSES.NOT_FOUND,
      );
    });
  });

  describe.each([
    ["POST /blogs", (body: object) => createBlog(body as BlogInputModel)],
    ["PUT /blogs/:id", (body: object) => updateBlog(blog.id, body)],
  ])("%s validation", (_, send) => {
    it.each(INVALID_INPUTS)(
      "returns 400 for invalid %s (case %#)",
      async (field, value) => {
        const res = await send({ ...otherInput, [field]: value }).expect(
          HTTP_STATUSES.BAD_REQUEST,
        );
        expect(res.body).toEqual(fieldErrors(field));
        expect(await getBlogs()).toEqual([blog]);
      },
    );

    it("returns one error per invalid field", async () => {
      const res = await send({}).expect(HTTP_STATUSES.BAD_REQUEST);
      expect(res.body).toEqual(
        fieldErrors("name", "description", "websiteUrl"),
      );
    });
  });

  describe.each([
    ["POST /blogs", () => api.post(BLOGS_URL).send(otherInput)],
    ["PUT /blogs/:id", () => api.put(blogUrl(blog.id)).send(otherInput)],
    ["DELETE /blogs/:id", () => api.delete(blogUrl(blog.id))],
  ])("%s authorization", (_, makeRequest) => {
    it.each(BAD_AUTH_HEADERS)("returns 401 with %s", async (_, header) => {
      const test = makeRequest();
      await (header ? test.set("Authorization", header) : test).expect(
        HTTP_STATUSES.UNAUTHORIZED,
      );
      expect(await getBlogs()).toEqual([blog]);
    });
  });
});
