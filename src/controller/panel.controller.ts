import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response ,sendEmail,sendEmailOtp} from "../helper/commonResponseHandler";
import { PanelDocument, Panel } from "../model/panel.model";
import { Users } from "../model/users.model";
import { Company} from "../model/company.model";
import *  as TokenManager from "../utils/tokenManager";
import { Doctor } from "../model/doctor.model";

var activity = "Panel";

/**
 *  
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save Panel
 */

export let savePanel = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const panelData = await Panel.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const usersData = await Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const companyData = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const doctorData = await Doctor.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!panelData && !usersData && !companyData && !panelData) {
                const panelDetails: PanelDocument = req.body;
                let otp = Math.floor(1000 + Math.random() * 9000);
                panelDetails.otp=otp
                const uniqueId = Math.floor(Math.random() * 10000);
                const createData = new Panel(panelDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                });
                const result = {}
                result['_id'] = insertData._id
                result["otp"]=otp
                let finalResult = {};
                finalResult["loginType"] = 'panel';
                finalResult["panelDetails"] = result;
                finalResult["token"] = token;
                sendEmailOtp(insertData.email,insertData.otp)
                sendEmail(insertData.email,insertData.otp)
                response(req, res, activity, 'Level-2', 'Save-Panel', true, 200, result, clientError.otp.otpSent);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Panel', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Panel', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Panel ', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



/**
 *  
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Panel
 */

export let getallPanel = async (req, res, next) => {
    try{
        const panel = await Panel.find({ isDeleted: false }).select('image');
        response(req, res, activity, 'Level-2', 'Get-All-Panel', true, 200, panel, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-Panel', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single Panel
 */

export let getSinglePanel = async (req, res, next) => {
    try{
        const panel = await Panel.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Get-Single-Panel', true, 200, panel, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Panel', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 *  
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Profile Details
 */

export let getProfileDetails = async (req, res, next) => {
    try{
        const panel = await Panel.findById({ _id:req.query._id });
        response(req, res, activity, 'Level-2', 'Get-ProfileDetails-Panel', true, 200, panel, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-ProfileDetails-Panel', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete Panel
 */

export let deletePanel = async (req, res, next) => {
    try{
        let {modifiedOn,modifiedBy} = req.body;
        const panel = await Panel.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        response(req, res, activity, 'Level-2', 'Delete-Panel', true, 200, panel, clientError.success.deleteSuccess);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Panel', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   10-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Panel
 */

export let updatePanel = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const panelDetail : PanelDocument = req.body;
            const updateData = await Panel.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    email: panelDetail.email,
                    name: panelDetail.name,
                    mobileNumber: panelDetail.mobileNumber,
                    profileImage: panelDetail.profileImage,
                    companyName: panelDetail.companyName,
                    companyAddress: panelDetail.companyAddress,
                    typesOfBusiness: panelDetail.typesOfBusiness,
                    city: panelDetail.city,
                    state: panelDetail.state,   
                    modifiedOn: panelDetail.modifiedOn,
                    modifiedBy: panelDetail.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Panel', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Panel', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Panel', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


/**
 *  
 * @author Santhosh Khan K
 * @date   08-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered Panel
 */

export let getFilteredPanel = async (req, res, next) => {
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
    if (req.body.companyName) {
        andList.push({ companyName: req.body.companyName })
    }
    if (req.body.mobileNumber) {
        andList.push({ mobileNumber: req.body.mobileNumber })
    }
    if (req.body.gender) {
        andList.push({ gender: req.body.gender })
    }

    findQuery =(andList.length > 0) ? { $and: andList } : {}
    var panelList = await Panel.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
    var panelCount = await Panel.find(findQuery).count()
    response(req, res, activity, 'Level-1', 'Get-FilterUser', true, 200, { panelList, panelCount }, clientError.success.fetchedSuccessfully);
}
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterUser', false, 500, {}, errorMessage.internalServer, err.message);
    }   

}

/**
 * @author Santhosh Khan K
 * @date   10-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get All Panel Profile
 */

export let getallPanelProfile  = async (req, res, next) => {
    try{
        const panel = await Panel.find({ isDeleted: false }).select('profileImage').limit(8);
        response(req, res, activity, 'Level-2', 'Get-All-Panel', true, 200, panel, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-Panel', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author Santhosh Khan K
 * @date   31-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update panel sellerAddress
 */

export let updatePanelSellerAddress = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const panelDetails: PanelDocument = req.body;
            const panelConnect = await Panel.findOne({ _id: req.body._id })
            if (panelConnect) {
                const panelData = await Panel.findByIdAndUpdate(
                    { _id: panelDetails._id }, // find panel id 
                    {$set:{
                        'sellerAddress.$[ele].name': panelDetails.sellerAddress.name,
                        'sellerAddress.$[ele].moblieNumber': panelDetails.sellerAddress.mobileNumber,
                        'sellerAddress.$[ele].street': panelDetails.sellerAddress.street,
                        'sellerAddress.$[ele].city': panelDetails.sellerAddress.city,
                        'sellerAddress.$[ele].landmark': panelDetails.sellerAddress.landmark,
                        'sellerAddress.$[ele].state': panelDetails.sellerAddress.state,
                        'sellerAddress.$[ele].pincode': panelDetails.sellerAddress.pincode,
                        'sellerAddress.$[ele].alternativeMobileNumber': panelDetails.sellerAddress.alternativeMobileNumber,
                        'sellerAddress.$[ele].locality': panelDetails.sellerAddress.locality,
                        'sellerAddress.$[ele].useMyCurretAddress': panelDetails.sellerAddress.useMyCurretAddress
                      }},
                    {
                        arrayFilters: [{ 'ele._id': panelDetails.sellerAddress._id },],//find array index filter concept
                        new: true
                    }
                );
                response(req, res, activity, 'Level-2', 'Update-panelsellerAddress', true, 200, panelData, 'Successfully Add sellerAddress');
            }
            else {
                response(req, res, activity, 'Level-2', 'Update-panelsellerAddress', true, 200, {}, 'panel NOt Found');
            }
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-panelsellerAddress', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-panelsellerAddress', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}