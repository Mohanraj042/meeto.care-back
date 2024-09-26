import {Router} from 'express';
import {saveCompany,getAllCompany,deleteCompany,updateCompany,getSingleCompany,getProfileDetails,getFilteredCompany,updateCompanySellerAddress} from '../controller/company.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/', // create company
    basicAuthUser,
    checkRequestBodyParams('email'),
    saveCompany
);  

router.get('/', // get all company
    basicAuthUser,
    checkSession,
    getAllCompany
);

router.put('/', // update company
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateCompany
);

router.delete('/', // delete company
    basicAuthUser,
    checkSession, 
    checkQuery('_id'),  
    deleteCompany
);  

router.get('/getsingleCompany', // get single company
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleCompany
);

router.get('/getProfileDetails', // get single company
    basicAuthUser,
    checkSession,
    getProfileDetails
);

router.put('/getFilterCompany', // get filtered company
    basicAuthUser,
    checkSession,
    getFilteredCompany
);

router.put('/updateCompanySellerAddress', // update company
    basicAuthUser,
    checkSession,
    updateCompanySellerAddress
);


export default router;