import type { Request, Response } from "express";
import { HTTP_STATUSES } from "../../core/http/http-statuses";
import { PostInputModel } from "./dto/post.input.dto";
import { postsService } from "./post.service";
import { PostViewModel } from "./types/post.types";

export const postsController = {
  getAll: async (_: Request, res: Response) => {
    const posts = await postsService.getAll();
    return res.status(HTTP_STATUSES.OK).send(posts);
  },

  getById: async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;

    const post = await postsService.getById(id);

    if (!post) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.status(HTTP_STATUSES.OK).send(post);
  },

  create: async (req: Request<{}, PostViewModel, PostInputModel>, res: Response) => {
    const body = req.body;
    const newPost = await postsService.create(body);

    if (!newPost) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
    }
    return res.status(HTTP_STATUSES.CREATED).send(newPost);
  },

  update: async (req: Request<{ id: string }, PostViewModel, PostInputModel>, res: Response) => {
    const id = req.params.id;
    const body = req.body;

    const updatedPost = await postsService.update(id, body);

    if (!updatedPost) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  },

  remove: async (req: Request<{ id: string }, void, void>, res: Response) => {
    const id = req.params.id;

    const deletedPost = await postsService.remove(id);

    if (!deletedPost) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  },
};
