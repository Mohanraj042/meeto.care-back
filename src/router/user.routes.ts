import {Router} from 'express';
import {saveUsers,getAllUser,updateUser,deleteUser,getSingleUser,getProfileDetails,getFilteredUser} from '../controller/users.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/', // create user
    basicAuthUser,
    checkRequestBodyParams('email'),
    saveUsers
);

router.get('/', // get all user
    basicAuthUser,
    checkSession,
    getAllUser
);

router.put('/', // update user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateUser
);

router.delete('/', // delete user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteUser
);

router.get('/getSingleUser', // get single user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleUser
);

router.get('/getProfileDetails', // get Profile Details
    basicAuthUser,
    checkSession,
    getProfileDetails
);

router.put('/getFilteredUser', // get filtered user
    basicAuthUser,
    checkSession,
    getFilteredUser
);



export default router;