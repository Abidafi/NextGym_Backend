import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma'; 

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, isSuspended: true } });
    res.status(200).json({ success: true, data: users });
  } catch (error) { next(error); }
};

export const toggleUserSuspension = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { isSuspended } = req.body;
    const updated = await prisma.user.update({ where: { id }, data: { isSuspended }, select: { id: true, name: true, email: true, isSuspended: true, role: true } });
    
    res.status(200).json({ success: true, message: 'User runtime status updated', data: updated });
  } catch (error) { next(error); }
};

export const adminGetALlGear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gear = await prisma.gearItem.findMany({ 
      include: { 
        provider: { select: { name: true, email: true } },
        category: true 
      } 
    });
    res.status(200).json({ success: true, data: gear });
  } catch (error) { next(error); }
};

export const adminGetAllRentals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rentals = await prisma.rentalOrder.findMany({
      include: {
        customer: { select: { name: true, email: true } },
        gearItem: { select: { title: true, name: true, pricePerDay: true } }
      }
    });
    res.status(200).json({ success: true, data: rentals });
  } catch (error) { next(error); }
};