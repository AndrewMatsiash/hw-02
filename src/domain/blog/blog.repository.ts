import { db } from "../../db/db";
import { BlogInputModel } from "./dto/blog.input.dto";
import { BlogViewModel } from "./types/blog.types";

export const blogsRepository = {
  getAll: (): BlogViewModel[] => db.blogs.map((blog) => ({ ...blog })),
  getById: (id: string): BlogViewModel | undefined => {
    const blog = db.blogs.find((blog) => blog.id === id);
    return blog && { ...blog };
  },
  create: (body: BlogInputModel): BlogViewModel => {
    const dbBlogRecord: BlogViewModel = {
      id: String(++db.lastBlogId),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
    };
    db.blogs.push(dbBlogRecord);
    return { ...dbBlogRecord };
  },
  update: (id: string, data: BlogInputModel): BlogViewModel | undefined => {
    const index = db.blogs.findIndex((blog) => blog.id === id);

    if (index === -1) return undefined;

    const { name, description, websiteUrl } = data;

    const updatedBlog: BlogViewModel = {
      ...db.blogs[index],
      name,
      description,
      websiteUrl,
    };
    db.blogs[index] = updatedBlog;
    return { ...updatedBlog };
  },
  remove: (id: string): BlogViewModel | undefined => {
    const index = db.blogs.findIndex((blog) => blog.id === id);

    if (index === -1) return undefined;

    const deleted = db.blogs.splice(index, 1)[0];
    return { ...deleted };
  },
  clearAll: () => {
    db.blogs = [];
    db.lastBlogId = 0;
  },
};
