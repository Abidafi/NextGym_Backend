import { Router } from 'express';
import { 
  createRentalOrder, 
  getMyOrders, 
  getProviderOrders, 
  getRentalDetails, 
  updateOrderStatus 
} from '../controllers/rental.controller';
import { authGuard } from '../middlewares/authGuard';
import { validateRequest } from '../middlewares/validateRequest';
import { createRentalSchema } from '../validations/rental.validation';

const router = Router();

router.post('/', authGuard('CUSTOMER'), validateRequest(createRentalSchema), createRentalOrder);
router.get('/', authGuard('CUSTOMER'), getMyOrders);
router.get('/provider', authGuard('PROVIDER'), getProviderOrders);
router.patch('/provider/:id', authGuard('PROVIDER'), updateOrderStatus);
router.get('/:id', authGuard('CUSTOMER', 'PROVIDER', 'ADMIN'), getRentalDetails);
router.patch('/:id', authGuard('CUSTOMER', 'ADMIN', 'PROVIDER'), updateOrderStatus);

export default router;