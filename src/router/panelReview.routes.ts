import {Router} from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import {savePanelReview,getAllPanelReview,getSinglePanelReview,deletePanelReview,updatePanelReview,getFilterPanelReview} from '../controller/panelReview.controller';
const router:Router=Router();

router.post('/', // create product
    basicAuthUser,
    checkSession,
    savePanelReview
);

router.get('/', // get all product
    basicAuthUser,
    getAllPanelReview
);

router.put('/', // update product
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updatePanelReview
);

router.delete('/', // delete product
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deletePanelReview
);

router.get('/getSinglePanelReview', // get single product
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSinglePanelReview
);


router.put('/getFilterPanelReview', // get single product
    basicAuthUser,
    checkSession,
    getFilterPanelReview
);


export default router;