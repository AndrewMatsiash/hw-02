import type { Request, Response } from "express";
import { HTTP_STATUSES } from "../../core/http/http-statuses";
import { PostInputModel } from "./dto/post.input.dto";
import { postsService } from "./post.service";
import { PostViewModel } from "./types/post.types";

export const postsController = {
  getAll: (_: Request, res: Response) => {
    const posts = postsService.getAll();
    return res.status(HTTP_STATUSES.OK).send(posts);
  },
  getById: (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;

    const post = postsService.getById(id);

    if (!post) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.status(HTTP_STATUSES.OK).send(post);
  },
  create: (req: Request<{}, PostViewModel, PostInputModel>, res: Response) => {
    const body = req.body;
    const newPost = postsService.create(body);
    return res.status(HTTP_STATUSES.CREATED).send(newPost);
  },
  update: (
    req: Request<{ id: string }, PostViewModel, PostInputModel>,
    res: Response,
  ) => {
    const id = req.params.id;
    const body = req.body;

    const updatedPost = postsService.update(id, body);

    if (!updatedPost) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  },
  remove: (req: Request<{ id: string }, void, void>, res: Response) => {
    const id = req.params.id;

    const deletedPost = postsService.remove(id);

    if (!deletedPost) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  },
};
