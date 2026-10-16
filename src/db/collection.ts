import { Collection, Db } from "mongodb";
import { BlogViewModel } from "../domain/blog/types/blog.types";
import { PostViewModel } from "../domain/post/types/post.types";

export const BLOG_COLLECTION_NAME = "blogs";
export const POST_COLLECTION_NAME = "posts";

export class CollectionsManager {
  readonly blogs: Collection<BlogViewModel>;
  readonly posts: Collection<PostViewModel>;

  constructor(db: Db) {
    this.blogs = db.collection(BLOG_COLLECTION_NAME);
    this.posts = db.collection(POST_COLLECTION_NAME);
  }

  getAll() {
    return [this.blogs, this.posts];
  }
}

export let collections: CollectionsManager;

export function initCollections(db: Db) {
  collections = new CollectionsManager(db);
}
