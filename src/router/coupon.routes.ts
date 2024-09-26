import { Router } from "express";
import { createCoupon,getTodayCoupon} from "../controller/coupon.controller";
import { checkRequestBodyParams, checkQuery } from "../middleware/Validators";
import { basicAuthUser } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";
const router: Router = Router();



router.post('/createCoupon', // create chat message for user
    basicAuthUser, 
    checkSession,
    checkRequestBodyParams('companyId'), 
    createCoupon
);

router.get('/getCouponForCurrentDay',
    basicAuthUser,  
    checkSession,
    getTodayCoupon
);    


export default router;