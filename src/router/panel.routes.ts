import {Router} from 'express';
import {getallPanel,deletePanel,updatePanel,savePanel,getSinglePanel,getProfileDetails,getFilteredPanel,getallPanelProfile,updatePanelSellerAddress} from '../controller/panel.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/', // create company
    basicAuthUser,
    checkRequestBodyParams('mobileNumber'),
    savePanel
);

router.get('/', // get all company
    basicAuthUser,
    checkSession,
    getallPanel
);

router.put('/', // update company
    basicAuthUser,
    checkSession,
    updatePanel
);

router.delete('/', // delete company
    basicAuthUser,
    checkSession, 
    checkQuery('_id'),
    deletePanel
);

router.get('/getSinglePanel', // get single company
    basicAuthUser,
     checkSession,
    checkQuery('_id'),
    getSinglePanel
);

router.get('/getProfileDetails',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getProfileDetails
);

router.put('/getFilterPanel',
    basicAuthUser,
    checkSession,
    getFilteredPanel
);

router.get('/getallPanelProfile',
    basicAuthUser,
    getallPanelProfile
);

router.put('/updatePanelSellerAddress',
    basicAuthUser,
    checkSession,
    updatePanelSellerAddress
);


export default router;