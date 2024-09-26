import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response ,sendEmailOtp,sendEmail} from "../helper/commonResponseHandler";
import { Users,UsersDocument } from "../model/users.model";
import { Panel,PanelDocument } from "../model/panel.model";
import { Company,CompanyDocument } from "../model/company.model";
import { Doctor,DoctorDocument } from "../model/doctor.model";
import *  as TokenManager from "../utils/tokenManager";

var activity = "Users";

/**
 * @author Santhosh Khan K
 * @date   09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save users
 */
export let saveUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const usersData = await Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const panelData = await Panel.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const companyData = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const doctorData = await Doctor.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!usersData && !panelData && !companyData && !doctorData) {
                const usersDetails: UsersDocument = req.body;
                let otp = Math.floor(1000 + Math.random() * 9000);
                usersDetails.otp=otp
                const uniqueId = Math.floor(Math.random() * 10000);
                const createData = new Users(usersDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                });
                const result = {}
                result['_id'] = insertData._id
                result["otp"]=otp
                let finalResult = {};
                finalResult["loginType"] = 'users';
                finalResult["usersDetails"] = result;
                finalResult["token"] = token;
                sendEmailOtp(insertData.email,insertData.otp)
                sendEmail(insertData.email,insertData.otp)
                response(req, res, activity, 'Level-2', 'Save-Users', true, 200, result, clientError.otp.otpSent);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Users', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Users', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Users ', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all user
 */

export let getAllUser = async (req, res, next) => {
    try{
        const user = await Users.find({ isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-All-user', true, 200, user, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-user', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single user
 */

export let getSingleUser = async (req, res, next) => {
    try{
        const user = await Users.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Get-Single-user', true, 200, user, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-user', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single user
 */

export let getProfileDetails = async (req, res, next) => {
    try{
        const user = await Users.findById({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Get-ProfileDetails-User', true, 200, user, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-ProfileDetails-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 *  
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete user
 */

export let deleteUser = async (req, res, next) => {
    try{
        let {modifiedOn,modifiedBy} = req.body;
        const user = await Users.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        response(req, res, activity, 'Level-2', 'Delete-user', true, 200, user, clientError.success.deleteSuccess);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-user', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update user
 */

export let updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const userDetail : UsersDocument = req.body;
            const updateData = await Users.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    email: userDetail.email,
                    name: userDetail.name,
                    fullName: userDetail.fullName,
                    mobileNumber: userDetail.mobileNumber,
                    profileImage: userDetail.profileImage,
                    gender: userDetail.gender,
                    address: userDetail.address,
                    city: userDetail.city,
                    state: userDetail.state,
                    pincode: userDetail.pincode,
                    landmark: userDetail.landmark,
                    alternativeMobileNumber: userDetail.alternativeMobileNumber,
                    locality: userDetail.locality,
                    useMyCurretAddress: userDetail.useMyCurretAddress,  
                    modifiedOn: userDetail.modifiedOn,
                    modifiedBy: userDetail.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-User', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


/**
 *  
 * @author Santhosh Khan K
 * @date   08-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered user
 */

export let getFilteredUser = async (req, res, next) => {
    try{
    var findQuery;
    var andList: any = []
    var limit = req.body.limit ? req.body.limit : 0;
    var page = req.body.page ? req.body.page : 0;
    andList.push({isDeleted:false})
    andList.push({status:1})
    if (req.body.email) {
        andList.push({ email: req.body.email })
    }
    if (req.body.name) {
        andList.push({ name: req.body.name })
    }
    if (req.body.mobileNumber) {
        andList.push({ mobileNumber: req.body.mobileNumber })
    }
    if (req.body.gender) {
        andList.push({ gender: req.body.gender })
    }
    if(req.body.city){
        andList.push({city:req.body.city})
    }

    findQuery =(andList.length > 0) ? { $and: andList } : {}
    var userList = await Users.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
    var userCount = await Users.find(findQuery).count()
    response(req, res, activity, 'Level-1', 'Get-FilterUser', true, 200, { userList, userCount }, clientError.success.fetchedSuccessfully);
}
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterUser', false, 500, {}, errorMessage.internalServer, err.message);
    }   

}
