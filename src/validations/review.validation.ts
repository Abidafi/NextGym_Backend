import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().min(5, 'Comment must be at least 5 characters long'),
  }),
});