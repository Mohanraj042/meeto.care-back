import { Router } from 'express';
const router: Router = Router();


import Login from './login.routes';
import User from './user.routes';
import  Product  from './product.routes';
import Panel from './panel.routes';
import Company from './company.routes';
import  Order  from './order.routes';
import  Language  from './language.routes';
import  AddToCart from './addToCart.routes';
import  Doctor  from './doctor.routes';
import  Faq  from './faq.routes';
import Contact  from './contact.routes';
import Invoice  from './invoice.routes';
import  Notification  from './notification.routes';
import Post from './post.routes';   
import Chat from './chat.routes';
import CarouselItem  from './carouselItem.routes';
import Appoinment from './doctorAppoiment.routes';
import  Category  from './category.routes';
import  Coupon  from './coupon.routes';
import ProductRating  from './productRating.routes';
import DoctorReview  from './doctorReview.routes';
import  PanelReview from './panelReview.routes';


router.use('/login', Login)
router.use('/user', User)
router.use('/company', Company)
router.use('/product', Product)
router.use('/panel', Panel)
router.use('/order', Order)
router.use('/language', Language)
router.use('/addToCart', AddToCart)
router.use('/doctor', Doctor)
router.use('/faq', Faq)
router.use('/contact', Contact)
router.use('/invoice', Invoice)
router.use('/notification', Notification)
router.use('/post', Post)
router.use('/chatfree', Chat)
router.use('/carouselItem', CarouselItem)
router.use('/doctorAppointment', Appoinment)
router.use('/category', Category)
router.use('/coupon', Coupon)
router.use('/productRating', ProductRating)
router.use('/doctorReview', DoctorReview)
router.use('/panelReview', PanelReview)

export default router;