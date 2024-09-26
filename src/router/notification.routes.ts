import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import { getAllNotification, getFilterNotification, getUnviewedNotification, updateNotificationView } from '../controller/notification.controller';
const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkSession,
    getAllNotification
);

router.put('/getFilterNotification',
    basicAuthUser,
    checkSession,
    getFilterNotification
);

router.put('/updateNotificationView',
    basicAuthUser,
    checkSession,
    updateNotificationView
);

router.get('/getUnviewedNotification',
    basicAuthUser,
    checkSession,
    getUnviewedNotification
);


export default router;