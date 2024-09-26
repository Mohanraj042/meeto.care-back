import {Router} from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import {saveProductRating,getAllProductRating,getSingleProductRating,deleteProductRating,updateProductRating,getFilterProductRating,getPanelRatings} from '../controller/productRating.controller';
const router:Router=Router();

router.post('/', // create product
    basicAuthUser,
    checkSession,
    saveProductRating
);

router.get('/', // get all product
    basicAuthUser,
    checkSession,
    getAllProductRating
);

router.put('/', // update product
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateProductRating
);

router.delete('/', // delete product
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteProductRating
);

router.get('/getSingleProductRating', // get single product
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleProductRating
);

router.put('/getFilterProductRating', // get single product
    basicAuthUser,
    checkSession,
    getFilterProductRating
);

router.get('/getPanelRatings', // get single product
    basicAuthUser,
    checkSession,
    checkQuery('panelId'),
    getPanelRatings
)

export default router;