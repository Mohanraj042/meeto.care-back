import {Router} from 'express';
import {  addCarouselItem ,getCarouselItems,updateCarousel,deleteCarousel,getFilteredCarousel,getSingleCarousel} from '../controller/carouselItem.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.post('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('companyId'),
    checkRequestBodyParams('title'),
    checkRequestBodyParams('content'),
    checkRequestBodyParams('image'),
    addCarouselItem
);

router.get('/',
    basicAuthUser,
    getCarouselItems 
);   

router.put('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateCarousel
);


router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteCarousel
);


router.put('/getFilterCarousel',
    basicAuthUser,
    getFilteredCarousel
);

router.get('/getSingleCarousel',
    basicAuthUser,
    getSingleCarousel,
    checkQuery('_id'),
    getSingleCarousel
);


export default router;
