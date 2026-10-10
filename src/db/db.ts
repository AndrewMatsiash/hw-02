import { BlogViewModel } from "../domain/blog/types/blog.types";
import { PostViewModel } from "../domain/post/types/post.types";

const seedBlogs: BlogViewModel[] = [
  {
    id: "1",
    name: "Node Internals",
    description:
      "A deep dive into Node.js internals: event loop, libuv, streams and workers.",
    websiteUrl: "https://node-internals.dev",
  },
  {
    id: "2",
    name: "SQL Explained",
    description:
      "Indexes, transactions and query plans without unnecessary theory.",
    websiteUrl: "https://sql-explained.com/blog",
  },
  {
    id: "3",
    name: "Backend Notes",
    description:
      "A backend developer's notes on architecture, testing and deployment.",
    websiteUrl: "https://backend-notes.io/posts",
  },
];

const seedPosts: PostViewModel[] = [
  {
    id: "1",
    title: "Event loop phases explained",
    shortDescription: "Timers, poll, check: what runs when and why.",
    content:
      "The Node.js event loop goes through a fixed set of phases on every tick. In this post we walk through each phase and see where setTimeout, setImmediate and process.nextTick callbacks end up.",
    blogId: "1",
    blogName: "Node Internals",
  },
  {
    id: "2",
    title: "Why indexes speed up reads",
    shortDescription: "B-tree indexes and the cost they add to writes.",
    content:
      "An index lets the database find rows without scanning the whole table. We look at how a B-tree index is laid out and why every extra index makes inserts and updates slower.",
    blogId: "2",
    blogName: "SQL Explained",
  },
];

export const db = {
  blogs: [...seedBlogs],
  lastBlogId: Math.max(0, ...seedBlogs.map((blog) => +blog.id)),
  posts: [...seedPosts],
  lastPostId: Math.max(0, ...seedPosts.map((post) => +post.id)),
};
