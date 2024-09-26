import {Router} from 'express';
import {saveProduct,getAllProduct,updateProduct,deleteProduct,getFilteredProduct,
    hotSelling,getSingleProduct,saveProductForWeb,getAllProductForWeb,hotSellingForWeb,
    getFilteredProductForWeb,saveProductForCompany,decreaseProductQuantity,productRating,updateSpecifications,getSingleProductFoeWeb} from '../controller/product.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/', // create product
    basicAuthUser,
    checkSession,
    saveProduct
);  

router.get('/', // get all product
    basicAuthUser,
    checkSession,
    getAllProduct
);

router.put('/', // update product
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateProduct
);

router.delete('/', // delete product
    basicAuthUser,
    checkSession,
    deleteProduct   
);

router.put('/getFilterProduct', // get filtered product
    basicAuthUser,
    checkSession,
    getFilteredProduct
);

router.get('/hotSellingForWeb', // get filtered product
    basicAuthUser,
    hotSellingForWeb
);

router.get('/hotSelling', // get filtered product
    basicAuthUser,
    checkSession,
    hotSelling
);

router.get('/getSingleProduct', // get single product
    basicAuthUser,
    checkQuery('_id'),
    getSingleProduct
);

router.post('/productForWeb', // save product for web
    basicAuthUser,
    saveProductForWeb   
);

router.get('/singleProduct', // get single product
    basicAuthUser,
    checkQuery('_id'),
    getSingleProductFoeWeb
);

router.get('/getAllProductForWeb', // get all product for web //without checking session
    basicAuthUser,
    getAllProductForWeb
);

router.put('/getFilterProductForWeb', // get filtered product for web //without checking session
    basicAuthUser,
    getFilteredProductForWeb
);

router.post('/productForCompany', // save product for company
    basicAuthUser,
    checkSession,
    saveProductForCompany
);

router.post('/decreaseProductQuantity', // decrease product quantity
    basicAuthUser,
    checkSession,
    decreaseProductQuantity
);

router.post('/productRating', // product rating
    basicAuthUser,
    checkSession,
    productRating
);


router.put('/updateSpecifications', // update specifications
    basicAuthUser,
    checkSession,
    updateSpecifications
);



export default router;