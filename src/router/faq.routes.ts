import { Router } from 'express';
import { saveFaq,replyDoctor,getSingleUser,getFilterFaq,deleteFaq,getAllFaq} from '../controller/faq.controller';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";

const router: Router = Router();


router.post('/',
  basicAuthUser,
  checkSession,
  saveFaq
);


router.post('/replydoctor',
  basicAuthUser,
  checkSession,
  replyDoctor
);

router.get('/getSingleUser',
  basicAuthUser,
  checkSession,
  checkQuery('_id'),
  getSingleUser
);

router.get('/getFilterDeveloper',
  basicAuthUser,
  checkSession,
  getFilterFaq
);


router.delete('/',
  basicAuthUser,
  checkSession,
  checkRequestBodyParams('_id'),
  deleteFaq
);

router.get('/getAllQuestions',
  basicAuthUser,
  checkSession,
  getAllFaq
);




export default router;

