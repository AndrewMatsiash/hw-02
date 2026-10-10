import type { Request, Response } from "express";
import { HTTP_STATUSES } from "../../core/http/http-statuses";
import { blogsService } from "./blog.service";
import { BlogInputModel } from "./dto/blog.input.dto";
import { BlogViewModel } from "./types/blog.types";

export const blogsController = {
  getAll: (_: Request, res: Response) => {
    const blogs = blogsService.getAll();
    return res.status(HTTP_STATUSES.OK).send(blogs);
  },
  getById: (req: Request<{ id: string }>, res: Response) => {
    const blogId = req.params.id;

    const blog = blogsService.getById(blogId);

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.status(HTTP_STATUSES.OK).send(blog);
  },
  create: (req: Request<{}, BlogViewModel, BlogInputModel>, res: Response) => {
    const newBlog = blogsService.create(req.body);
    return res.status(HTTP_STATUSES.CREATED).send(newBlog);
  },
  update: (
    req: Request<{ id: string }, void, BlogInputModel>,
    res: Response,
  ) => {
    const id = req.params.id;

    const updatedBlog = blogsService.update(id, req.body);

    if (!updatedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  },
  remove: (req: Request<{ id: string }, void, void>, res: Response) => {
    const id = req.params.id;

    const deletedBlog = blogsService.remove(id);

    if (!deletedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  },
};
