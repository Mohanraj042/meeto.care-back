import {Router} from 'express';
import {bookAppointment,getAllAppointment,getSingleAppointment,deleteAppointment,getFilterAppointment,getDoctorAppointments,getUserAppointments,updatedAppointmentStatus} from '../controller/doctorAppoiment.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();


router.post('/bookAppointment', // get filtered user
    basicAuthUser,
    checkSession,  
    bookAppointment
);



router.get('/', // get filtered user
    basicAuthUser,
    checkSession,  
    getAllAppointment
);


router.get('/getSingleAppointment', // get filtered user
    basicAuthUser,
    checkSession,
    checkQuery('id'),  
    getSingleAppointment
);

router.delete('/', // get filtered user
    basicAuthUser,
    checkSession,
    checkQuery('id'),  
    deleteAppointment
);

router.put('/filterAppointment', // get filtered user
    basicAuthUser,
    checkSession,
    getFilterAppointment
);

router.get('/getDoctorAppointments', // get filtered user
    basicAuthUser,
    checkSession,
    getDoctorAppointments
);

router.get('/getUserAppointments', // get filtered user
    basicAuthUser,
    checkSession,
    getUserAppointments
);

router.put('/updatedStatus',
    basicAuthUser,  
    checkSession,
    checkRequestBodyParams('scheduleStatus'),
    updatedAppointmentStatus
)

export default router;