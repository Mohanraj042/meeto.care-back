import {Router} from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import {saveDoctorReview,getAllDoctorReview,getSingleDoctorReview,deleteDoctorReview,updateDoctorReview,getDoctorReviews,getFilterDoctorReview} from '../controller/doctorReview.controller';
const router:Router=Router();

router.post('/', // create product
    basicAuthUser,
    checkSession,
    saveDoctorReview
);

router.get('/', // get all product
    basicAuthUser,
    checkSession,
    getAllDoctorReview
);

router.put('/', // update product
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateDoctorReview
);

router.delete('/', // delete product
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteDoctorReview
);

router.get('/getSingleDoctorReview', // get single product
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleDoctorReview
);

router.get('/getDoctorReview',
    basicAuthUser,
    checkSession,
    checkQuery('doctorId'),
    getDoctorReviews
);

router.put('/getFilterDoctorReview',
    basicAuthUser,
    checkSession,
    getFilterDoctorReview
);


export default router;