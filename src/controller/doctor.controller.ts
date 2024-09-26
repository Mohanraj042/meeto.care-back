import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Doctor, DoctorDocument } from "../model/doctor.model";
import { Panel,PanelDocument } from "../model/panel.model";
import { Users,UsersDocument } from "../model/users.model";
import { Company,CompanyDocument } from "../model/company.model";
import { sendEmail,sendEmailOtp } from "../helper/commonResponseHandler";
import *  as TokenManager from "../utils/tokenManager";
 
var activity = "Doctor";
 
 
/**
 *  
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save Doctor
 */
 
export let saveDoctors = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const doctorData = await Doctor.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const panelData = await Panel.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const usersData = await Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const companyData = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!doctorData && !panelData && !usersData && !companyData) {
                const doctorDetails: DoctorDocument = req.body;
                let otp = Math.floor(1000 + Math.random() * 9000);
                doctorDetails.otp=otp
                const uniqueId = Math.floor(Math.random() * 10000);
                const createData = new Doctor(doctorDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["doctorName"],
                });
                const result = {}
                result['_id'] = insertData._id
                result["otp"]=otp
                let finalResult = {};
                finalResult["loginType"] = 'doctor';
                finalResult["doctorDetails"] = result;
                finalResult["token"] = token;
                sendEmailOtp(insertData.email,insertData.otp)
                sendEmail(insertData.email,insertData.otp)
                response(req, res, activity, 'Level-2', 'Save-Doctor', true, 200, result, clientError.otp.otpSent);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Doctor', true, 422, {}, 'Email already registered');
            }
 
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Doctor', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Doctor ', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
 
/**
 *  
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Doctor
 */
 
export let getAllDoctor = async (req, res, next) => {
    try{
        const DoctorData = await Doctor.find({ isDeleted: false }).sort({ createdAt: -1 });
        response(req, res, activity, 'Level-2', 'Get-All-Doctor', true, 200, DoctorData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-Doctor', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
   
/**
 *  
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single Doctor
 */
 
export let getSingleDoctor = async (req, res, next) => { 
    try{
        const DoctorData = await Doctor.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Get-Single-Doctor', true, 200, DoctorData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Doctor', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
 
/**
 *  
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Doctor ProfileDetails
 */
 
export let getProfileDetails = async (req, res, next) => {
    try{
        const DoctorData = await Doctor.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Get-Single-Doctor', true, 200, DoctorData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Doctor', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
 
 
/**
 *  
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete Doctor
 */
 
export let deleteDoctor = async (req, res, next) => {
    try{
        let {modifiedOn,modifiedBy} = req.body;
        const DoctorData = await Doctor.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        response(req, res, activity, 'Level-2', 'Delete-Doctor', true, 200,DoctorData , clientError.success.deleteSuccess);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Doctor', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
 
/**
 *  
 * @author Santhosh Khan K
 * @date   31-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Doctor
 */
 
export let updateDoctor = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const DoctorDetail : DoctorDocument = req.body;
            const updateData = await Doctor.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    email: DoctorDetail.email,
                    phone: DoctorDetail.phone,
                    doctorBio: DoctorDetail.doctorBio,
                    profileImage: DoctorDetail.profileImage,
                    gender: DoctorDetail.gender,
                    doctorName: DoctorDetail.doctorName,
                    overAllExperience: DoctorDetail.overAllExperience,
                    overAllQualification: DoctorDetail.overAllQualification,
                    address: DoctorDetail.address,
                    landLineNumber: DoctorDetail.landLineNumber,
                    language: DoctorDetail.language,
                    pincode: DoctorDetail.pincode,
                    specialization: DoctorDetail.specialization,
                    services: DoctorDetail.services,
                    city: DoctorDetail.city,
                    state: DoctorDetail.state, 
                    modifiedOn: DoctorDetail.modifiedOn,
                    modifiedBy: DoctorDetail.modifiedBy
                },$addToSet:{
                    experience: DoctorDetail.experience,
                    qualification: DoctorDetail.qualification,                    
                    
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Doctor', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Doctor', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Doctor', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
 
/**
 * @author Santhosh Khan K
 * @date   17-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Filtered Doctor
 */
 
export let getFilteredDoctor = async (req, res, next) => {
    try {
 
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        if (req.body.doctorName) {
            andList.push({ doctorName: { doctorName: req.body.doctorName } })
        }
        if (req.body.specialization) {
            andList.push({ specialization: { specialization: req.body.specialization } })
        }
        if (req.body.language) {
            andList.push({ language: { language: req.body.language } })
        }
        if (req.body.state) {
            andList.push({ state: { state: req.body.state } })
        }
        if (req.body.city) {
            andList.push({ city: { city: req.body.city } })
        }      
       
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const doctorList = await Doctor.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)
        const doctorCount = await Doctor.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { doctorList, doctorCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Santhosh Khan K
 * @date   13-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all doctor count
 */

export let getAllDoctorCount = async (req, res, next) => {
    try {
        const doctorCount = await Doctor.find({$and:[{isDeleted:false},{doctor:req.body.loginId} ]}).count()
        response(req, res, activity, 'Level-1', 'Get-AllDoctorCount', true, 200, { doctorCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-AllDoctorCount', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author Santhosh Khan K
 * @date   17-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get All Doctor Profile
 */

export let getAllDoctorProfile = async (req, res, next) => {
    try{
        const DoctorData = await Doctor.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(8);
        response(req, res, activity, 'Level-2', 'Get-All-Doctor', true, 200, DoctorData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-Doctor', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   18-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next       
 * @description This Function is used to get doctor review
 */

export let doctorReview = async (req, res, next) => {
    try{
         const { _id, rating, comment } = req.body;
        const doctorData = await Doctor.findByIdAndUpdate(_id, { $push: { reviews: { rating, comment } } }, { new: true });
        response(req, res, activity, 'Level-2', 'Get-Doctor-Review', true, 200, doctorData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Doctor-Review', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   18-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Doctor qualification
 */

export let updateDoctorQualification = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const doctorDetails: DoctorDocument = req.body;
            const doctorConnect = await Doctor.findOne({ _id: req.body._id })
            if (doctorConnect) {
                const doctorData = await Doctor.findByIdAndUpdate(
                    { _id: doctorDetails._id }, // find doctor id 
                    {$set:{
                        'qualification.$[ele].college': doctorDetails.qualification.college,
                        'qualification.$[ele].degree': doctorDetails.qualification.degree,
                        'qualification.$[ele].specialization': doctorDetails.qualification.specialization,
                        'qualification.$[ele].currentlyStudying': doctorDetails.qualification.currentlyStudying,
                        'qualification.$[ele].from': doctorDetails.qualification.from,
                        'qualification.$[ele].to': doctorDetails.qualification.to,
                        'qualification.$[ele].grade': doctorDetails.qualification.grade,
                        'qualification.$[ele].percentage': doctorDetails.qualification.percentage,
                        'qualification.$[ele].yearOfPassing': doctorDetails.qualification.yearOfPassing
                      }},
                    {
                        arrayFilters: [{ 'ele._id': doctorDetails.qualification._id },],//find array index filter concept
                        new: true
                    }
                );
                response(req, res, activity, 'Level-2', 'Update-doctorqualification', true, 200, doctorData, 'Successfully Add qualification');
            }
            else {
                response(req, res, activity, 'Level-2', 'Update-doctorqualification', true, 200, {}, 'doctor NOt Found');
            }
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-doctorqualification', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-doctorqualification', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


/**
 * @author Santhosh Khan K
 * @date   18-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Doctor experience
 */

export let updateDoctorExperience = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const doctorDetails: DoctorDocument = req.body;
            const doctorConnect = await Doctor.findOne({ _id: req.body._id })
            if (doctorConnect) {

                const DoctorData = await Doctor.findByIdAndUpdate(
                    { _id: doctorDetails._id },
                    {
                        $set: { 
                            'experience.$[ele].role': doctorDetails.experience.role,
                            'experience.$[ele].organization': doctorDetails.experience.organization,
                            'experience.$[ele].location': doctorDetails.experience.location,
                            'experience.$[ele].currentlyWorking': doctorDetails.experience.currentlyWorking,
                            'experience.$[ele].from': doctorDetails.experience.from,
                            'experience.$[ele].to': doctorDetails.experience.to,
                            'experience.$[ele].skills': doctorDetails.experience.skills,
                        } //update inside array index value
                    },
                    {
                        arrayFilters: [{ 'ele._id': doctorDetails.experience._id },],//find array index filter concep
                        new: true
                    }
                );
                response(req, res, activity, 'Level-2', 'Update-DoctorExperience', true, 200, DoctorData, 'Successfully Add Experience');
            }
            else {
                response(req, res, activity, 'Level-2', 'Update-DoctorExperience', true, 200, {}, 'Doctor NOt Found');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-DoctorExperience', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-DoctorExperience', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Santhosh Khan K
 * @date   17-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete doctor experience.
 */

export let deleteDoctorExperience = async (req, res, next) => {
    try {
        const doctorConnect = await Doctor.findOne({ _id: req.body._id })
        if (doctorConnect) {
            const doctorData = await Doctor.updateOne(
                { _id: req.body._id },
                { $pull: { experience: { _id: req.body.experienceId } } }
            );
            response(req, res, activity, 'Level-2', 'Update-DoctorExperience', true, 200, doctorData, 'Successfully Remove Experience');
        }
        else {
            response(req, res, activity, 'Level-2', 'Update-DoctorExperience', true, 200, {}, 'Doctor NOt Found');
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Update-DoctorExperience', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Santhosh Khan K
 * @date   17-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Doctor Qualification
 */

export let deleteDoctorQualification = async (req, res, next) => {
    try {
        const doctorConnect = await Doctor.findOne({ _id: req.body._id })
        if (doctorConnect) {
            const doctorData = await Doctor.updateOne(
                { _id: req.body._id },
                { $pull: { qualification: { _id: req.body.qualificationId } } }
            );
            response(req, res, activity, 'Level-2', 'delete-DoctorQualification', true, 200, doctorData, 'Successfully Remove Qualification');
        }
        else {
            response(req, res, activity, 'Level-2', 'delete-DoctorQualification', true, 200, {}, 'Doctor NOt Found');
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-DoctorQualification', false, 500, {}, errorMessage.internalServer, err.message);
    }
};