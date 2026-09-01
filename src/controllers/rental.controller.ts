import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../AppError'; 
import { prisma } from '../prisma';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createRentalOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { gearItemId, startDate, endDate, totalPrice, quantity } = req.body;
    const requestedQuantity = Number(quantity) || 1;

    const gear = await prisma.gearItem.findUnique({
      where: { id: gearItemId },
    });

    if (!gear || !gear.isAvailable || gear.stock < requestedQuantity) {
      return next(new AppError(400, 'Requested quantity exceeds available stock or gear is unavailable'));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const order = await prisma.$transaction(async (tx) => {
      const updatedGear = await tx.gearItem.update({
        where: { id: gearItemId },
        data: { stock: { decrement: requestedQuantity } },
      });

      if (updatedGear.stock <= 0) {
        await tx.gearItem.update({
          where: { id: gearItemId },
          data: { isAvailable: false, stock: 0 },
        });
      }

      return await tx.rentalOrder.create({
        data: {
          startDate: start,
          endDate: end,
          totalPrice,
          quantity: requestedQuantity,
          customerId: req.user!.id,
          gearItemId,
        },
      });
    });

    res.status(201).json({
      success: true,
      message: 'Rental order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prisma.rentalOrder.findMany({
      where: { customerId: req.user!.id },
      include: { gearItem: true, payments: true },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getProviderOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prisma.rentalOrder.findMany({
      where: {
        gearItem: {
          providerId: req.user!.id,
        },
      },
      include: {
        gearItem: true,
        customer: {
          select: { id: true, name: true, email: true },
        },
        payments: true,
      },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getRentalDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;

    const order = await prisma.rentalOrder.findUnique({
      where: { id },
      include: { 
        gearItem: true, 
        payments: true,
        customer: { select: { id: true, name: true, email: true } }
      },
    });

    if (!order) {
      return next(new AppError(404, 'Rental order not found'));
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body; 

    const order = await prisma.rentalOrder.findUnique({
      where: { id },
      include: { gearItem: true },
    });

    if (!order) {
      return next(new AppError(404, 'Rental order not found'));
    }

    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check authorization: Allow if user is an ADMIN, the owner customer, or the item provider
    const isOwnerCustomer = order.customerId === userId;
    const isItemProvider = order.gearItem?.providerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwnerCustomer && !isItemProvider && !isAdmin) {
      return next(new AppError(403, 'Unauthorized scope update access'));
    }

    // If a customer is updating, restrict them to only changing status to 'RETURNED'
    if (userRole === 'CUSTOMER' && status !== 'RETURNED') {
      return next(new AppError(403, 'Customers are only allowed to mark orders as returned'));
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.rentalOrder.update({
        where: { id },
        data: { status },
      });

      if (status === 'RETURNED') {
        const returnQty = (order as any).quantity || 1;
        await tx.gearItem.update({
          where: { id: order.gearItemId },
          data: { stock: { increment: returnQty }, isAvailable: true },
        });
      }

      return updated;
    });

    res.status(200).json({
      success: true,
      message: 'Order state updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};