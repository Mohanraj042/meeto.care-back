import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response ,sendEmail,sendEmailOtp} from "../helper/commonResponseHandler";
import { Company,CompanyDocument } from "../model/company.model";
import { Panel,PanelDocument } from "../model/panel.model";
import { Doctor,DoctorDocument } from "../model/doctor.model";
import { Users,UsersDocument } from "../model/users.model";
import *  as TokenManager from "../utils/tokenManager";

var activity = "Company";

/**
 *  
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to save Company
 */

export let saveCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const CompanyData = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const doctorData = await Doctor.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const panelData = await Panel.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const usersData = await Users.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!CompanyData && !doctorData && !panelData && !usersData) {
                const CompanyDetails: CompanyDocument = req.body;
                let otp = Math.floor(1000 + Math.random() * 9000);
                CompanyDetails.otp=otp
                const uniqueId = Math.floor(Math.random() * 10000);
                const createData = new Company(CompanyDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                });
                const result = {}
                result['_id'] = insertData._id
                result["otp"]=otp
                let finalResult = {};
                finalResult["loginType"] = 'Company';
                finalResult["CompanyDetails"] = result;
                finalResult["token"] = token;
                sendEmailOtp(insertData.email,insertData.otp)
                sendEmail(insertData.email,insertData.otp)
                response(req, res, activity, 'Level-2', 'Save-Company', true, 200, result, clientError.otp.otpSent);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Company', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Company', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Company ', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



/**
 *  
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all Company
 */

export let getAllCompany = async (req, res, next) => {
    try{
        const companyData = await Company.find({ isDeleted: false });
        response(req, res, activity, 'Level-2', 'Get-All-Company', true, 200, companyData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-Company', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single Company
 */

export let getSingleCompany = async (req, res, next) => {
    try{
        const companyData = await Company.findById({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Get-Single-Company', true, 200, companyData, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Company', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 *  
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete Company
 */

export let deleteCompany = async (req, res, next) => {
    try{
        let {modifiedOn,modifiedBy} = req.body;
        const companyData = await Company.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        response(req, res, activity, 'Level-2', 'Delete-Company', true, 200,companyData , clientError.success.deleteSuccess);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Company', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Company
 */

export let updateCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const companyDetail : CompanyDocument = req.body;
            const updateData = await Company.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    email: companyDetail.email,
                    name: companyDetail.name,
                    companyName: companyDetail.companyName,
                    mobileNumber: companyDetail.mobileNumber,
                    profileImage: companyDetail.profileImage,
                    companyAddress: companyDetail.companyAddress,
                    typesOfBusiness: companyDetail.typesOfBusiness,
                    city: companyDetail.city,
                    state: companyDetail.state,   
                    modifiedOn: companyDetail.modifiedOn,
                    modifiedBy: companyDetail.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Company', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Company', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Company', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Company
 */

export let getProfileDetails = async (req, res, next) => {
    try{
        const company = await Company.findById({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Get-ProfileDetails-User', true, 200, company, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-ProfileDetails-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 *  
 * @author Santhosh Khan K
 * @date   08-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Filtered Company
 */

export let getFilteredCompany = async (req, res, next) => {
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
    var companyList = await Company.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
    var companyCount = await Company.find(findQuery).count()
    response(req, res, activity, 'Level-1', 'Get-FilterUser', true, 200, { companyList, companyCount }, clientError.success.fetchedSuccessfully);
}
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterUser', false, 500, {}, errorMessage.internalServer, err.message);
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

export let updateCompanySellerAddress = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const companyDetails: CompanyDocument = req.body;
            const companyConnect = await Company.findOne({ _id: req.body._id })
            if (companyConnect) {
                const companyData = await Company.findByIdAndUpdate(
                    { _id: companyDetails._id }, // find company id 
                    {$set:{
                        'sellerAddress.$[ele].name': companyDetails.sellerAddress.name,
                        'sellerAddress.$[ele].moblieNumber': companyDetails.sellerAddress.mobileNumber,
                        'sellerAddress.$[ele].street': companyDetails.sellerAddress.street,
                        'sellerAddress.$[ele].city': companyDetails.sellerAddress.city,
                        'sellerAddress.$[ele].landmark': companyDetails.sellerAddress.landmark,
                        'sellerAddress.$[ele].state': companyDetails.sellerAddress.state,
                        'sellerAddress.$[ele].pincode': companyDetails.sellerAddress.pincode,
                        'sellerAddress.$[ele].alternativeMobileNumber': companyDetails.sellerAddress.alternativeMobileNumber,
                        'sellerAddress.$[ele].locality': companyDetails.sellerAddress.locality,
                        'sellerAddress.$[ele].useMyCurretAddress': companyDetails.sellerAddress.useMyCurretAddress
                      }},
                    {
                        arrayFilters: [{ 'ele._id': companyDetails.sellerAddress._id },],//find array index filter concept
                        new: true
                    }
                );
                response(req, res, activity, 'Level-2', 'Update-companysellerAddress', true, 200, companyData, 'Successfully Add sellerAddress');
            }
            else {
                response(req, res, activity, 'Level-2', 'Update-companysellerAddress', true, 200, {}, 'company NOt Found');
            }
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-companysellerAddress', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-companysellerAddress', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}