import {Router} from "express";
const router:Router = Router();
import { saveContact,getAllUser,getSingleUsers,deletedUsers,getFilterContact } from "../controller/contact.controller";
import {basicAuthUser} from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";

router.post('/', //save contact  // without checking session
    basicAuthUser,
    saveContact
)

router.get('/', //get all contact   
    basicAuthUser,
    checkSession,
    getAllUser
);  

router.get('/getSingleUser',  //get single user   
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleUsers
);

router.delete ('/',  //delete users',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deletedUsers
);

router.put('/getFilterContact',  //get filter for users',
   basicAuthUser,
  checkSession,
  checkRequestBodyParams('_id'),
  getFilterContact 
);


export default router;
