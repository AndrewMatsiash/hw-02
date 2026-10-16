import { collections } from "../../db/collection";
import { PostInputModel } from "./dto/post.input.dto";

export const postsRepository = {
  getAll: async () => collections.posts.find({}).toArray(),

  getById: async (id: string) => await collections.posts.findOne({ id }),

  create: async ({ body, blogName }: { body: PostInputModel; blogName: string }) => {
    const { title, shortDescription, content, blogId } = body;

    const newPost = await collections.posts.insertOne({
      id: crypto.randomUUID(),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    });

    return newPost;
  },

  update: async ({ id, body, blogName }: { id: string; body: PostInputModel; blogName: string }) => {
    const { title, shortDescription, content, blogId } = body;

    const newPost = await collections.posts.findOneAndUpdate(
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

    if (!newPost) return null;

    return newPost;
  },

  remove: async (id: string) => {
    const deletedPost = await collections.posts.deleteOne({ id });

    if (!deletedPost) return null;

    return deletedPost;
  },

  updateBlogName: (blogId: string, blogName: string) => {
    collections.posts.findOneAndUpdate(
      { id: blogId },
      {
        $set: {
          blogName,
        },
      },
    );
  },

  removeByBlogId: async (blogId: string) => {
    await collections.posts.deleteMany({ blogId });
  },

  clearAll: async () => {
    await collections.posts.deleteMany({});
  },
};
