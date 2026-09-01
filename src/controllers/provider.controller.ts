import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authGuard';
import { AppError } from '../AppError';
import { prisma } from '../prisma';

export const getProviderGear = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const providerId = req.user!.id;

    const gearList = await prisma.gearItem.findMany({
      where: { providerId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      gear: gearList,
    });
  } catch (error) {
    next(error);
  }
};

export const addGear = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, brand, pricePerDay, stock, categoryId, imageUrl, images } = req.body;
    const providerId = req.user!.id;

    let finalImages: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      finalImages = images;
    } else if (imageUrl) {
      finalImages = [imageUrl];
    } else if (Array.isArray(req.body.images)) {
      finalImages = req.body.images;
    }

    const newGear = await prisma.gearItem.create({
      data: {
        title,
        description,
        brand,
        pricePerDay: Number(pricePerDay),
        stock: Number(stock),
        categoryId,
        providerId,
        images: finalImages,
      },
    });

    res.status(201).json({ success: true, data: newGear });
  } catch (error) {
    next(error);
  }
};

export const updateGear = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const providerId = req.user!.id;

    const gear = await prisma.gearItem.findUnique({ where: { id } });
    if (!gear || gear.providerId !== providerId) {
      return next(new AppError(403, 'Unauthorized to update this gear item'));
    }

    const updatedGear = await prisma.gearItem.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json({ success: true, data: updatedGear });
  } catch (error) {
    next(error);
  }
};

export const deleteGear = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const providerId = req.user!.id;

    const gear = await prisma.gearItem.findUnique({ where: { id } });
    if (!gear || gear.providerId !== providerId) {
      return next(new AppError(403, 'Unauthorized to delete this gear item'));
    }

    await prisma.gearItem.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Gear item removed successfully' });
  } catch (error) {
    next(error);
  }
};