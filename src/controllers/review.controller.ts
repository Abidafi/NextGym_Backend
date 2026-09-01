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

    // Check if a review already exists for this specific order/gear item by this user
    const existingReview = await prisma.review.findFirst({
      where: {
        customerId: req.user!.id,
        gearItemId: verifiedOrder.gearItemId,
      }
    });

    if (existingReview) {
      return next(new AppError(400, 'You have already submitted a review for this rental item.'));
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

export const getReviewByOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orderId = String(req.params.orderId);

    const verifiedOrder = await prisma.rentalOrder.findFirst({
      where: {
        id: orderId,
        customerId: req.user!.id,
      },
      include: { gearItem: true }
    });

    if (!verifiedOrder) {
      return next(new AppError(404, 'Rental order not found.'));
    }

    const review = await prisma.review.findFirst({
      where: {
        customerId: req.user!.id,
        gearItemId: verifiedOrder.gearItemId,
      },
      include: {
        gearItem: true,
      }
    });

    if (!review) {
      return next(new AppError(404, 'No review found for this order.'));
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};