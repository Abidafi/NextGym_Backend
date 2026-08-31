import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { AuthenticatedRequest } from '../middlewares/authGuard';
import { AppError } from '../AppError';
import { prisma } from '../prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });

export const createPaymentIntent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { rentalOrderId } = req.body;
    const order = await prisma.rentalOrder.findUnique({ where: { id: rentalOrderId } });

    if (!order) return next(new AppError(404, 'Rental target matching identity not found'));

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Stripe currency cents unit format rules
      currency: 'usd',
      metadata: { rentalOrderId },
      payment_method_types: ['card'],
    });

    res.status(200).json({ success: true, data: { clientSecret: intent.client_secret, transactionId: intent.id } });
  } catch (error) { next(error); }
};

export const confirmPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { transactionId, rentalOrderId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

    if (paymentIntent.status !== 'succeeded') return next(new AppError(400, 'Stripe Gateway has not processed this transaction successfully'));

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.rentalOrder.update({ where: { id: rentalOrderId }, data: { status: 'PAID' } });
      const paymentRecord = await tx.payment.create({
        data: { transactionId, amount: paymentIntent.amount / 100, status: 'COMPLETED', rentalOrderId, paidAt: new Date() },
      });
      return { updatedOrder, paymentRecord };
    });

    res.status(200).json({ success: true, message: 'Payment confirmed and processing state complete', data: result });
  } catch (error) { next(error); }
};

export const getPaymentHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const history = await prisma.payment.findMany({ where: { rentalOrder: { customerId: req.user!.id } }, include: { rentalOrder: true } });
    res.status(200).json({ success: true, data: history });
  } catch (error) { next(error); }
};

export const getPaymentDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: String(id) },
      include: {
        rentalOrder: {
          include: {
            gearItem: true,
          },
        },
      },
    });

    if (!payment) return next(new AppError(404, 'Payment record not found'));

    res.status(200).json({ success: true, data: payment });
  } catch (error) { next(error); }
};