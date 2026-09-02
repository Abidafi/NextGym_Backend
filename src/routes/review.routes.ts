import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard';
import { validateRequest } from '../middlewares/validateRequest';
import { createReviewSchema } from '../validations/review.validation';
import { createReview, getReviewByOrder } from '../controllers/review.controller';

const router = Router();

router.post(
  '/',
  authGuard('CUSTOMER'),
  validateRequest(createReviewSchema),
  createReview
);

router.get(
  '/order/:orderId',
  authGuard('CUSTOMER', 'PROVIDER'),
  getReviewByOrder
);

export default router;