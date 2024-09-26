import { Router } from 'express';
import { checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { login,sendMailOtp,verifyGmailOtp,verifyEmailOtp} from "../controller/login.controller";
const router: Router = Router();


router.post('/userLogin',   //for user  //without checking session
    basicAuthUser,
    checkRequestBodyParams('email'),
    login     
);


router.post('/verifyGmailOtp',    //without checking session
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('otp'),
    verifyGmailOtp
);  

router.post('/panelLogin',  //for panel  //without checking session
    basicAuthUser,
    checkRequestBodyParams('email'),
    login
);

router.post('/companyLogin',  //for company  //without checking session
    basicAuthUser,
    checkRequestBodyParams('email'),
    login
);

router.post('/doctorLogin',  //for doctor   //without checking session
    basicAuthUser,
    checkRequestBodyParams('email'),
    login
);

router.post('/verifyEmailOtp',    //without checking session
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('otp'),
    verifyEmailOtp
); 

export default router;