import { Router } from 'express';
import { getDoctorChats,getUserSentChats,doctorSendMessages,userSendMessages,getAllChats,markMessageAsSeen} from '../controller/chat.controller';
import { checkRequestBodyParams, checkQuery } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';

const router: Router = Router();

router.get('/getUserChats', // get all product
  basicAuthUser,
  checkSession,
  checkQuery('userId'),
  getUserSentChats
);

router.get('/getDoctorChats', // get single userid all products view
  basicAuthUser,
  checkSession,
  checkQuery('doctorId'),
  getDoctorChats
);


router.post('/doctorChat', // create chat message for user
  basicAuthUser,
  checkSession,
  checkRequestBodyParams('userId'),
  checkRequestBodyParams('doctorId'),
  checkRequestBodyParams('message'),
  doctorSendMessages
);

router.post('/userChat', // create chat message for user
  basicAuthUser,
  checkSession,
  checkRequestBodyParams('userId'),
  checkRequestBodyParams('doctorId'),
  checkRequestBodyParams('message'),
  userSendMessages
);

router.get('/', // get all product
  basicAuthUser,
  checkSession,
  getAllChats
);

router.put('/markSeen', // get all product
  basicAuthUser,
  checkSession,
  checkRequestBodyParams('messageId'),
  markMessageAsSeen
);


export default router;
