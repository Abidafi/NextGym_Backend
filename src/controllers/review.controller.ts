import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authGuard';
import { AppError } from '../AppError';
import { prisma } from '../prisma';

export const createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { rating, comment, orderId } = req.body;

    const verifiedOrder = await prisma.rentalOrder.findFirst({
      where: {
        id: orderId,
        customerId: req.user!.id,
        status: 'RETURNED'
      },
      include: { gearItem: true }
    });

    if (!verifiedOrder) {
      return next(new AppError(400, 'You can only review gear items from a completed and returned rental order.'));
    }

    const review = await prisma.review.create({
      data: { 
        rating, 
        comment, 
        customerId: req.user!.id, 
        gearItemId: verifiedOrder.gearItemId 
      }
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully', data: review });
  } catch (error) { 
    next(error); 
  }
};