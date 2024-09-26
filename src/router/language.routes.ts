import {Router} from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { getLanguages, changeLanguage,changedLanguage } from '../controller/language.controller';
import { basicAuthUser } from '../middleware/checkAuth';
const router:Router=Router();

router.get('/', // get all languages  //without checking session
    checkQuery('code'),
    getLanguages
);

router.post('/', // change language\   //without checking session
    checkRequestBodyParams('code'),
    changeLanguage
);

router.post('/changedLanguage', // change language\   //without checking session
    basicAuthUser,
    checkRequestBodyParams('newLanguage'),
    changedLanguage
);

export default router;