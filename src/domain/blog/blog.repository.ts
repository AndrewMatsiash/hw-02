import { collections } from "../../db/collection";
import { BlogInputModel } from "./dto/blog.input.dto";
import { BlogViewModel } from "./types/blog.types";

export const blogsRepository = {
  getAll: async () => collections.blogs.find({}, { projection: { _id: 0 } }).toArray(),

  getById: async (id: string) => {
    return collections.blogs.findOne({ id }, { projection: { _id: 0 } });
  },

  create: async (body: BlogInputModel) => {
    const dbBlogRecord: BlogViewModel = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
    };

    await collections.blogs.insertOne(dbBlogRecord);
    return { ...dbBlogRecord };
  },

  update: async (id: string, data: BlogInputModel) => {
    const result = await collections.blogs.findOneAndUpdate(
      { id },
      {
        $set: {
          name: data.name,
          description: data.description,
          websiteUrl: data.websiteUrl,
        },
      },
      {
        returnDocument: "after",
        projection: { _id: 0 },
      },
    );

    return result;
  },

  remove: async (id: string) => {
    const existing = await collections.blogs.findOne({ id }, { projection: { _id: 0 } });

    if (!existing) return null;

    await collections.blogs.deleteOne({ id });
    return existing;
  },

  clearAll: async () => {
    await collections.blogs.deleteMany({});
  },
};
