import { Collection } from "mongodb";
import { BlogInputModel } from "./dto/blog.input.dto";
import { BlogViewModel } from "./types/blog.types";

export class BlogsRepository {
  constructor(private readonly blogs: Collection<BlogViewModel>) {}

  getAll() {
    return this.blogs.find({}, { projection: { _id: 0 } }).toArray();
  }

  async getById(id: string) {
    return this.blogs.findOne({ id }, { projection: { _id: 0 } });
  }

  async create(body: BlogInputModel) {
    const dbBlogRecord: BlogViewModel = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
    };

    const blogView = { ...dbBlogRecord };

    await this.blogs.insertOne(dbBlogRecord);
    return blogView;
  }

  async update(id: string, data: BlogInputModel) {
    const result = await this.blogs.findOneAndUpdate(
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
  }

  async remove(id: string) {
    const existing = await this.blogs.findOne(
      { id },
      { projection: { _id: 0 } },
    );

    if (!existing) return null;

    await this.blogs.deleteOne({ id });
    return existing;
  }

  async clearAll() {
    await this.blogs.deleteMany({});
  }
}
