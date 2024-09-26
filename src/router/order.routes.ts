import {Router} from 'express';
import {saveOrder,getAllOrder,deleteOrder,updateOrder,getSingleOrder,trackOrderNumber,trackTrakingNumber,getFilteredOrder,updateOrderStatus,cancelOrReturnOrder }from '../controller/order.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/', // create order // without checking session
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('userId'),
    saveOrder
);

router.get('/', // get all orders
    basicAuthUser,
    checkSession,
    getAllOrder
);

router.put('/', // update order
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateOrder
);

router.delete('/', // delete order
    basicAuthUser,
    checkSession,
    checkQuery('_id'),  
    deleteOrder
);


router.get('/getSingleOrder', // get single order
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleOrder
);

router.get('/trackOrderNumber', // track order
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('orderNumber'),
    trackOrderNumber

);

router.get('/trackTrakingNumber', // track order
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('trakingNumber'),
    trackTrakingNumber
);

router.put('/getFilteredOrder', // get filtered order
    basicAuthUser,
    checkSession,
    getFilteredOrder
);

router.put('/updateOrderStatus', // update order status
    basicAuthUser,
    checkSession,
    updateOrderStatus
);

router.put('/cancelOrReturnOrder', // cancel ordered
    basicAuthUser,
    checkSession,
    cancelOrReturnOrder
);




export default router;
