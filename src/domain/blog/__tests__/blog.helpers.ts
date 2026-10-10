import { api, withAuth } from "../../../__tests__/utils";
import { ROUTES } from "../../../shared/routes";
import { BlogInputModel } from "../dto/blog.input.dto";

export const BLOGS_URL = `${ROUTES.base}${ROUTES.blogs}`;
export const blogUrl = (id: string) => `${BLOGS_URL}/${id}`;

export const validBlogInput: BlogInputModel = {
  name: "Node Internals",
  description: "A deep dive into Node.js internals",
  websiteUrl: "https://node-internals.dev",
};

export const createBlog = (input: BlogInputModel = validBlogInput) =>
  withAuth(api.post(BLOGS_URL)).send(input);
