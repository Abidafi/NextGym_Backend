import { Router } from 'express';
import { createPaymentIntent, confirmPayment, getPaymentHistory, getPaymentDetails } from '../controllers/payment.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();
router.post('/create', authGuard('CUSTOMER'), createPaymentIntent);
router.post('/confirm', authGuard('CUSTOMER'), confirmPayment);
router.get('/history', authGuard('CUSTOMER'), getPaymentHistory); 
router.get('/:id', authGuard('CUSTOMER'), getPaymentDetails);

export default router;