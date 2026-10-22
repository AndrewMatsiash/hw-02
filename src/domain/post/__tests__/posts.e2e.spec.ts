import { HTTP_STATUSES } from "../../../core/http/http-statuses";
import { ROUTES } from "../../../shared/routes";
import { api, BAD_AUTH_HEADERS, fieldErrors, resetDb, UNKNOWN_ID, withAuth } from "../../../__tests__/utils";
import { blogUrl, createBlog, validBlogInput } from "../../blog/__tests__/blog.helpers";
import { BlogViewModel } from "../../blog/types/blog.types";
import { PostInputModel } from "../dto/post.input.dto";
import { PostViewModel } from "../types/post.types";

const POSTS_URL = `${ROUTES.base}${ROUTES.posts}`;
const postUrl = (id: string) => `${POSTS_URL}/${id}`;

const createPost = (input: object) => withAuth(api.post(POSTS_URL)).send(input);
const updatePost = (id: string, input: object) => withAuth(api.put(postUrl(id))).send(input);
const getPosts = async () => (await api.get(POSTS_URL)).body;

describe("/posts", () => {
  let blog: BlogViewModel;
  let post: PostViewModel;
  let validInput: PostInputModel;

  beforeEach(async () => {
    await resetDb();
    blog = (await createBlog().expect(HTTP_STATUSES.CREATED)).body;
    validInput = {
      title: "Event loop phases",
      shortDescription: "Timers, poll, check",
      content: "What runs when and why",
      blogId: blog.id,
    };
    post = (await createPost(validInput).expect(HTTP_STATUSES.CREATED)).body;
  });

  describe("GET /posts", () => {
    it("returns 200 and an empty array after reset", async () => {
      await resetDb();
      await api.get(POSTS_URL).expect(HTTP_STATUSES.OK, []);
    });

    it("returns all posts", async () => {
      const other = (await createPost({ ...validInput, title: "Other" })).body;
      expect(await getPosts()).toEqual([post, other]);
    });
  });

  describe("GET /posts/:id", () => {
    it("returns 200 and the post", async () => {
      await api.get(postUrl(post.id)).expect(HTTP_STATUSES.OK, post);
    });

    it("returns 404 for an unknown id", async () => {
      await api.get(postUrl(UNKNOWN_ID)).expect(HTTP_STATUSES.NOT_FOUND);
    });
  });

  describe("POST /posts", () => {
    it("returns 201 and the created post with blogName of its blog", () => {
      expect(post).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        ...validInput,
        blogName: blog.name,
      });
    });

    it("assigns unique ids", async () => {
      const other = (await createPost(validInput)).body;
      expect(other.id).not.toBe(post.id);
    });

    it("trims string fields", async () => {
      const res = await createPost({ ...validInput, title: "  Trimmed  " });
      expect(res.body.title).toBe("Trimmed");
    });

    it("ignores client id, blogName and unknown fields", async () => {
      const res = await createPost({
        ...validInput,
        id: post.id,
        blogName: "Fake",
        extra: true,
      });
      expect(res.body).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        ...validInput,
        blogName: blog.name,
      });
      expect(res.body.id).not.toBe(post.id);
    });
  });

  describe("PUT /posts/:id", () => {
    it("returns 204 and updates the post", async () => {
      const input = { ...validInput, title: "Updated" };
      await updatePost(post.id, input).expect(HTTP_STATUSES.NO_CONTENT);
      await api.get(postUrl(post.id)).expect(HTTP_STATUSES.OK, {
        ...post,
        ...input,
      });
    });

    it("recalculates blogName when blogId changes", async () => {
      const otherBlog = (await createBlog({ ...validBlogInput, name: "Other" })).body;
      await updatePost(post.id, { ...validInput, blogId: otherBlog.id });
      const updated = (await api.get(postUrl(post.id))).body;
      expect(updated).toMatchObject({
        blogId: otherBlog.id,
        blogName: "Other",
      });
    });

    it("ignores client id, blogName and unknown fields", async () => {
      await updatePost(post.id, {
        ...validInput,
        id: UNKNOWN_ID,
        blogName: "Fake",
        extra: true,
      });
      expect(await getPosts()).toEqual([post]);
    });

    it.each([UNKNOWN_ID, "abc"])("returns 404 for unknown id %p", async (id) => {
      await updatePost(id, validInput).expect(HTTP_STATUSES.NOT_FOUND);
      expect(await getPosts()).toEqual([post]);
    });
  });

  describe("when its blog changes", () => {
    let otherPost: PostViewModel;

    beforeEach(async () => {
      const otherBlog = (await createBlog({ ...validBlogInput, name: "Other" })).body;
      otherPost = (await createPost({ ...validInput, blogId: otherBlog.id })).body;
    });

    it("keeps blogName in sync when the blog is renamed", async () => {
      await withAuth(api.put(blogUrl(blog.id)))
        .send({ ...validBlogInput, name: "Renamed" })
        .expect(HTTP_STATUSES.NO_CONTENT);

      expect(await getPosts()).toEqual([{ ...post, blogName: "Renamed" }, otherPost]);
    });

    it("removes its posts when the blog is deleted", async () => {
      await withAuth(api.delete(blogUrl(blog.id))).expect(HTTP_STATUSES.NO_CONTENT);

      expect(await getPosts()).toEqual([otherPost]);
    });
  });

  describe.each([
    ["POST /posts", (body: object) => createPost(body)],
    ["PUT /posts/:id", (body: object) => updatePost(post.id, body)],
  ])("%s validation", (_, send) => {
    it.each<[keyof PostInputModel, unknown]>([
      ["title", undefined],
      ["title", 123],
      ["title", ""],
      ["title", "   "],
      ["title", "a".repeat(31)],
      ["shortDescription", undefined],
      ["shortDescription", ""],
      ["shortDescription", "a".repeat(101)],
      ["content", undefined],
      ["content", ""],
      ["content", "a".repeat(1001)],
      ["blogId", undefined],
      ["blogId", 1],
      ["blogId", ""],
      ["blogId", UNKNOWN_ID],
    ])("returns 400 for invalid %s (case %#)", async (field, value) => {
      const res = await send({ ...validInput, [field]: value }).expect(HTTP_STATUSES.BAD_REQUEST);
      expect(res.body).toEqual(fieldErrors(field));
      expect(await getPosts()).toEqual([post]);
    });

    it("returns one error per invalid field", async () => {
      const res = await send({}).expect(HTTP_STATUSES.BAD_REQUEST);
      expect(res.body).toEqual(fieldErrors("title", "shortDescription", "content", "blogId"));
    });
  });

  describe.each([
    ["POST /posts", () => api.post(POSTS_URL).send(validInput)],
    ["PUT /posts/:id", () => api.put(postUrl(post.id)).send(validInput)],
  ])("%s authorization", (_, makeRequest) => {
    it.each(BAD_AUTH_HEADERS)("returns 401 with %s", async (_, header) => {
      const test = makeRequest();
      await (header ? test.set("Authorization", header) : test).expect(HTTP_STATUSES.UNAUTHORIZED);
      expect(await getPosts()).toEqual([post]);
    });
  });
});
