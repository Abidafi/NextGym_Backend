import { Router } from 'express';
import { addGear, updateGear, deleteGear, getProviderGear } from '../controllers/provider.controller';
import { getProviderOrders, updateOrderStatus } from '../controllers/rental.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();

// Gear Inventory Management
router.get('/gear', authGuard('PROVIDER'), getProviderGear);
router.post('/gear', authGuard('PROVIDER'), addGear);
router.put('/gear/:id', authGuard('PROVIDER'), updateGear);
router.delete('/gear/:id', authGuard('PROVIDER'), deleteGear);

// Incoming Orders Management (Mapped to Provider endpoints)
router.get('/orders', authGuard('PROVIDER'), getProviderOrders);
router.patch('/orders/:id', authGuard('PROVIDER'), updateOrderStatus);

export default router;