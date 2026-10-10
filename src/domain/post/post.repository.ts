import { db } from "../../db/db";
import { PostInputModel } from "./dto/post.input.dto";
import { PostViewModel } from "./types/post.types";

export const postsRepository = {
  getAll: (): PostViewModel[] => db.posts.map((post) => ({ ...post })),
  getById: (id: string): PostViewModel | undefined => {
    const post = db.posts.find((post) => post.id === id);
    return post && { ...post };
  },
  create: ({
    body,
    blogName,
  }: {
    body: PostInputModel;
    blogName: string;
  }): PostViewModel => {
    const { title, shortDescription, content, blogId } = body;

    const newPost = {
      id: String(++db.lastPostId),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    };

    db.posts.push(newPost);

    return { ...newPost };
  },
  update: ({
    id,
    body,
    blogName,
  }: {
    id: string;
    body: PostInputModel;
    blogName: string;
  }): PostViewModel | undefined => {
    const index = db.posts.findIndex((post) => post.id === id);

    if (index === -1) return undefined;

    const { title, shortDescription, content, blogId } = body;

    const updatedPost: PostViewModel = {
      ...db.posts[index],
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    };
    db.posts[index] = updatedPost;
    return { ...updatedPost };
  },
  remove: (id: string): PostViewModel | undefined => {
    const index = db.posts.findIndex((post) => post.id === id);

    if (index === -1) return undefined;

    const deleted = db.posts.splice(index, 1)[0];
    return { ...deleted };
  },
  updateBlogName: (blogId: string, blogName: string): void => {
    db.posts = db.posts.map((post) =>
      post.blogId === blogId ? { ...post, blogName } : post,
    );
  },
  removeByBlogId: (blogId: string): void => {
    db.posts = db.posts.filter((post) => post.blogId !== blogId);
  },
  clearAll: (): void => {
    db.posts = [];
    db.lastPostId = 0;
  },
};
