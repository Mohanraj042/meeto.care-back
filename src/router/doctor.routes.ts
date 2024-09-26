import {Router} from "express";
const router:Router = Router();
import { saveDoctors,getAllDoctor,updateDoctor,getSingleDoctor,deleteDoctor,getProfileDetails,getFilteredDoctor,updateDoctorExperience,updateDoctorQualification,deleteDoctorExperience,deleteDoctorQualification,getAllDoctorProfile,doctorReview } from "../controller/doctor.controller";
import {basicAuthUser} from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";
 
 
router.post('/', // create user
    basicAuthUser,
    checkRequestBodyParams('doctorName'),
    saveDoctors
);
 
router.get('/', // get all user
    basicAuthUser,
    checkSession,
    getAllDoctor
);
 
router.put('/', // update user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateDoctor
);
 
router.delete('/', // delete user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteDoctor
);
 
router.get('/getSingleDoctor', // get single user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleDoctor
);
 
router.get('/getProfileDetails', // get Profile Details
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getProfileDetails
);
 
router.put('/getFilteredDoctor', // get filtered user
    basicAuthUser,
    checkSession,  
    getFilteredDoctor
);

router.get('/getFilteredDoctorCount', // get filtered user
    basicAuthUser,
    checkSession,  
    getFilteredDoctor
);


router.get('/getAllDoctorProfile', // get filtered user  // without Checking Session
    basicAuthUser,  
    getAllDoctorProfile
);


router.put('/updateDoctorExperience', // get filtered user
    basicAuthUser,
    checkSession,   
    updateDoctorExperience
);
 
router.put('/updateDoctorQualification', // get filtered user
    basicAuthUser,
    checkSession,
    updateDoctorQualification
);

router.put('/deleteDoctorExperience', // get filtered user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('experienceId'),
    deleteDoctorExperience
);

router.put('/deleteDoctorQualification', // get filtered user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('qualificationId'),
    deleteDoctorQualification                                       
);

router.post('/doctorReview', // get filtered user
    basicAuthUser,
    checkSession,  
    doctorReview
);




export default router;