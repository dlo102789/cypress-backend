import express from 'express';
import ReviewCrudController from '../controllers/reviewCrudController';
const reviewRouter = express.Router();

reviewRouter.post("/add", ReviewCrudController.createReview);
reviewRouter.post("/update/:id", ReviewCrudController.updateReview);
reviewRouter.delete("/delete/:id", ReviewCrudController.deleteReview);
reviewRouter.get("/:id", ReviewCrudController.getReview);
reviewRouter.get("/", ReviewCrudController.getReviews);

export default reviewRouter;