import type { Request, Response } from "express";
import { HTTP_STATUSES } from "../../core/http/http-statuses";
import { BlogsService } from "./blog.service";
import { BlogInputModel } from "./dto/blog.input.dto";
import { BlogViewModel } from "./types/blog.types";

export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  getAll = async (_: Request, res: Response) => {
    const blogs = await this.blogsService.getAll();
    return res.status(HTTP_STATUSES.OK).send(blogs);
  };

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const blogId = req.params.id;

    const blog = await this.blogsService.getById(blogId);

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.status(HTTP_STATUSES.OK).send(blog);
  };

  create = async (req: Request<{}, BlogViewModel, BlogInputModel>, res: Response) => {
    const newBlog = await this.blogsService.create(req.body);
    return res.status(HTTP_STATUSES.CREATED).send(newBlog);
  };

  update = async (req: Request<{ id: string }, void, BlogInputModel>, res: Response) => {
    const id = req.params.id;

    const updatedBlog = await this.blogsService.update(id, req.body);

    if (!updatedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  };

  remove = async (req: Request<{ id: string }, void, void>, res: Response) => {
    const id = req.params.id;

    const deletedBlog = await this.blogsService.remove(id);

    if (!deletedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  };
}
