import { Collection } from "mongodb";
import { PostInputModel } from "./dto/post.input.dto";
import { PostViewModel } from "./types/post.types";

export class PostsRepository {
  constructor(private readonly posts: Collection<PostViewModel>) {}

  getAll() {
    return this.posts.find({}, { projection: { _id: 0 } }).toArray();
  }

  async getById(id: string) {
    return this.posts.findOne({ id }, { projection: { _id: 0 } });
  }

  async create({ body, blogName }: { body: PostInputModel; blogName: string }) {
    const { title, shortDescription, content, blogId } = body;

    const newPost: PostViewModel = {
      id: crypto.randomUUID(),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    };
    const postView = { ...newPost };

    await this.posts.insertOne(newPost);
    return postView;
  }

  async update({
    id,
    body,
    blogName,
  }: {
    id: string;
    body: PostInputModel;
    blogName: string;
  }) {
    const { title, shortDescription, content, blogId } = body;

    const updatedPost = await this.posts.findOneAndUpdate(
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
  }

  async remove(id: string) {
    const existing = await this.posts.findOne({ id }, { projection: { _id: 0 } });

    if (!existing) return null;

    await this.posts.deleteOne({ id });
    return existing;
  }

  async updateBlogName(blogId: string, blogName: string) {
    await this.posts.updateMany({ blogId }, { $set: { blogName } });
  }

  async removeByBlogId(blogId: string) {
    await this.posts.deleteMany({ blogId });
  }

  async clearAll() {
    await this.posts.deleteMany({});
  }
}
