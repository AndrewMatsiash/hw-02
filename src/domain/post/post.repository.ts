import { collections } from "../../db/collection";
import { PostInputModel } from "./dto/post.input.dto";
import { PostViewModel } from "./types/post.types";

export const postsRepository = {
  getAll: async () => collections.posts.find({}, { projection: { _id: 0 } }).toArray(),

  getById: async (id: string) => {
    return collections.posts.findOne({ id }, { projection: { _id: 0 } });
  },

  create: async ({ body, blogName }: { body: PostInputModel; blogName: string }) => {
    const { title, shortDescription, content, blogId } = body;

    const newPost: PostViewModel = {
      id: crypto.randomUUID(),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    };

    await collections.posts.insertOne(newPost);
    return newPost;
  },

  update: async ({
    id,
    body,
    blogName,
  }: {
    id: string;
    body: PostInputModel;
    blogName: string;
  }) => {
    const { title, shortDescription, content, blogId } = body;

    const updatedPost = await collections.posts.findOneAndUpdate(
      { id },
      {
        $set: {
          title,
          shortDescription,
          content,
          blogId,
          blogName,
        },
      },
      { returnDocument: "after", projection: { _id: 0 } },
    );

    return updatedPost;
  },

  remove: async (id: string) => {
    const existing = await collections.posts.findOne({ id }, { projection: { _id: 0 } });

    if (!existing) return null;

    await collections.posts.deleteOne({ id });
    return existing;
  },

  updateBlogName: async (blogId: string, blogName: string) => {
    await collections.posts.updateMany({ blogId }, { $set: { blogName } });
  },

  removeByBlogId: async (blogId: string) => {
    await collections.posts.deleteMany({ blogId });
  },

  clearAll: async () => {
    await collections.posts.deleteMany({});
  },
};
