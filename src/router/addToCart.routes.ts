import {Router} from 'express';
import {getSingleAddToCart,getAllCartDetails,deleteAddToCart,savedAddToCart,updateAddToCart,deleteProductFromCart}from '../controller/addToCart.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/', //  products add to cart
    basicAuthUser,
    //checkSession,
    checkRequestBodyParams('userId'),
    savedAddToCart
);

router.get('/', // get single userid all products view
    basicAuthUser,
    checkSession,
    getAllCartDetails
);

router.get('/getSingleAddToCart', // get single cart
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleAddToCart);


router.delete('/deletedAddToCart', // delete cart
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteAddToCart
);



router.delete('/productdelete', // single product delete
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('productId'),
    deleteProductFromCart);

router.post('/orderplace', // order place
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('userId'),
    updateAddToCart)

export default router;