import {Router} from 'express';
import {  addCategory,getCategories,updateCategory,deleteCategory,getCategoryById,getFilteredCategory} from '../controller/category.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/',
    basicAuthUser,
    checkSession,
    addCategory
);

router.get('/', //getall
    basicAuthUser,
    getCategories
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('name'),
    updateCategory
);

router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteCategory
);

router.get('/getSingleCategory',
    basicAuthUser,
    checkQuery('_id'),
    getCategoryById
);


router.put('/getFilterCategory',
    basicAuthUser,
    getFilteredCategory
    );



export default router;