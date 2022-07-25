import express from 'express';
const bookRouter = express.Router();

import BooksCrudController from '../controllers/booksCrudController';

bookRouter.post("/add", BooksCrudController.createBook);
bookRouter.post("/update", BooksCrudController.updateBooks);
bookRouter.delete("/delete", BooksCrudController.deleteBook);
bookRouter.get("/:id", BooksCrudController.getBook);
bookRouter.get("/", BooksCrudController.getBooks);

export default bookRouter;