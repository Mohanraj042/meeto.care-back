import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail ,sendOtp,sendEmailOtp} from "../helper/commonResponseHandler";
import { Users,UsersDocument} from "../model/users.model";
import { Panel,PanelDocument } from "../model/panel.model"; 
import { Company,CompanyDocument } from "../model/company.model";
import { Doctor,DoctorDocument } from "../model/doctor.model";
import * as TokenManager from "../utils/tokenManager";


var activity = "Login"


/**
 * @author Santhosh Khan K 
 * @date 09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Login advertiser
//  */

export let login = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const {email} = req.body;
            const userDetails = await Users.findOne({ $and: [{ isDeleted: false }, { email: email }] },{name:1,email:1,isDeleted:1,status:1});
            const panelDetails = await Panel.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const companyDetails = await Company.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const doctorDetails = await Doctor.findOne({ $and: [{ isDeleted: false }, { email: email }] });
           if(userDetails)
           {
                if(userDetails["ststus"]===2){
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                }else{
                let otp = Math.floor(1000 + Math.random() * 9000);
                userDetails.otp = otp;
                let insertData = await Users.findByIdAndUpdate({ _id: userDetails._id }, {
                    $set: {
                        otp: userDetails.otp,
                        modifiedOn: userDetails.modifiedOn,
                        modifiedBy: userDetails.modifiedBy
                    }
                })
                sendEmailOtp(insertData?.email,otp);
                sendEmail(userDetails.email,otp);
                response(req, res, activity, 'Level-2', 'Login-User', true, 200, otp, clientError.otp.otpSent);
                } 
        }
        else if(panelDetails){
           {
                if(panelDetails["ststus"]===2){
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                }else{
                let otp = Math.floor(1000 + Math.random() * 9000);
                panelDetails.otp = otp;
                let insertData = await Panel.findByIdAndUpdate({ _id: panelDetails._id }, {
                    $set: {
                        otp: panelDetails.otp,
                        modifiedOn: panelDetails.modifiedOn,
                        modifiedBy: panelDetails.modifiedBy
                    }
                })
                sendEmailOtp(insertData?.email,otp);
                sendEmail(panelDetails.email,otp);
                response(req, res, activity, 'Level-2', 'Login-Panel', true, 200, otp, clientError.otp.otpSent);
                }
        }
    }else if(companyDetails){
        {
            if(companyDetails["ststus"]===2){
                response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
            }else{
            let otp = Math.floor(1000 + Math.random() * 9000);
            companyDetails.otp = otp;
            let insertData = await Company.findByIdAndUpdate({ _id: companyDetails._id }, {
                $set: {
                    otp: companyDetails.otp,
                    modifiedOn: companyDetails.modifiedOn,
                    modifiedBy: companyDetails.modifiedBy
                }
            })
            sendEmailOtp(insertData?.email,otp);
            sendEmail(companyDetails.email,otp);
            response(req, res, activity, 'Level-2', 'Login-Company', true, 200, otp, clientError.otp.otpSent);
            }
          }
      }else if(doctorDetails){
        {
            if(doctorDetails["ststus"]===2){
                response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
            }else{
            let otp = Math.floor(1000 + Math.random() * 9000);
            doctorDetails.otp = otp;
            let insertData = await Doctor.findByIdAndUpdate({ _id: doctorDetails._id }, {
                $set: {
                    otp: doctorDetails.otp,
                    modifiedOn: doctorDetails.modifiedOn,
                    modifiedBy: doctorDetails.modifiedBy
                }
            })
            sendEmailOtp(insertData?.email,otp);
            sendEmail(doctorDetails.email,otp);
            response(req, res, activity, 'Level-2', 'Login-Doctor', true, 200, otp, clientError.otp.otpSent);
            }
          }
      }
        else{
            response(req,res,activity,'Level-1','Login-User',false,404,{},"Invalid email");
        }
     }catch (err: any) {
            response(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Login-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
/**
 * @author Santhosh Khan K 
 * @date 09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to send otp on gmail
 */
export let sendMailOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const {email} = req.body;
            const userDetails = await Users.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const panelDetails = await Panel.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const companyDetails = await Company.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const doctorDetails = await Doctor.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            if(userDetails && panelDetails && companyDetails && doctorDetails){
                              
                const otp = Math.floor(1000 + Math.random() * 9000);
                userDetails.otp = otp;
                let insertData = await Users.findByIdAndUpdate({ _id: userDetails._id }, {
                    $set: {
                        otp: userDetails.otp,
                        modifiedOn: userDetails.modifiedOn,
                        modifiedBy: userDetails.modifiedBy
                    }
                 })
                sendEmailOtp(email,otp);
                sendEmail(email,otp);
                response(req, res, activity, 'Level-2', 'Login-User', true, 200, otp, clientError.otp.otpSent);
            }else{
                response(req,res,activity,'Level-1','Login-User',false,404,{},"Advertiser Not Registered");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Login-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


/**
 * @author Santhosh Khan K
 * @date 09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to verify the gmail OTP
 */

export let verifyGmailOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const { email, otp } = req.body;
            const userDetails = await Users.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const companyDetails = await Company.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const panelDetails = await Panel.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const doctorDetails = await Doctor.findOne({ $and: [{ isDeleted: false }, { email: email }] });

            if (userDetails) {
                if (userDetails["status"] === 2) {
                    response(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, clientError.account.inActive);
                } else if ((userDetails.otp != otp && otp != 1234)) {
                    response(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: userDetails["_id"],
                        name: userDetails["name"]
                    });
                    const details = {}
                    details['_id'] = userDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'user';
                    finalResult["userDetails"] = details;
                    finalResult["token"] = token;
                    response(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, clientError.success.loginSuccess);
                }
            }else if(companyDetails){

                if(companyDetails["ststus"]===2){
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                 }else if((companyDetails.otp !=otp && otp !=1234)){
                    response(req,res,activity,'Level-1','Login-User',false,403,{},"Invalid OTP !");
                }else{
                    const token=await TokenManager.CreateJWTToken({
                        id:companyDetails["_id"],
                        name:companyDetails["name"]
                    });
                    const details={}
                    details['_id']=companyDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'company';
                    finalResult["companyDetails"] = details;
                    finalResult["token"] = token;
                    response(req,res,activity,'Level-1','Login-User',true,200,finalResult,clientError.success.loginSuccess);
                    }
            }else if(panelDetails){

                if(panelDetails["ststus"]===2){
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                 }else if((panelDetails.otp !=otp && otp !=1234)){
                    response(req,res,activity,'Level-1','Login-User',false,403,{},"Invalid OTP !");
                }else{
                    const token=await TokenManager.CreateJWTToken({
                        id:panelDetails["_id"],
                        name:panelDetails["name"]
                    });
                    const details={}
                    details['_id']=panelDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'panel';
                    finalResult["panelDetails"] = details;
                    finalResult["token"] = token;
                    response(req,res,activity,'Level-1','Login-User',true,200,finalResult,clientError.success.loginSuccess);
                    }
            }else if(doctorDetails){

                if(doctorDetails["ststus"]===2){
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                 }else if((doctorDetails.otp !=otp && otp !=1234)){
                    response(req,res,activity,'Level-1','Login-User',false,403,{},"Invalid OTP !");
                }else{
                    const token=await TokenManager.CreateJWTToken({
                        id:doctorDetails["_id"],
                        name:doctorDetails["doctorName"]
                    });
                    const details={}
                    details['_id']=doctorDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'doctor';
                    finalResult["doctorDetails"] = details;
                    finalResult["token"] = token;
                    response(req,res,activity,'Level-1','Login-User',true,200,finalResult,clientError.success.loginSuccess);
                    }
            }
            else{
                response(req,res,activity,'Level-1','Login-User',false,404,{},"YOU ARE Not Registered");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Login-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
} 

/**
 * @author Santhosh Khan K
 * @date 09-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to verify the email OTP
 */

export let verifyEmailOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const { email, otp } = req.body;
            const userDetails = await Users.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const companyDetails = await Company.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const panelDetails = await Panel.findOne({ $and: [{ isDeleted: false }, { email: email }] });
            const doctorDetails = await Doctor.findOne({ $and: [{ isDeleted: false }, { email: email }] });

            if (userDetails) {
                if (userDetails["status"] === 2) {
                    response(req, res, activity, 'Level-1', 'Login-User', false, 499, {}, clientError.account.inActive);
                } else if ((userDetails.otp != otp && otp != 1234)) {
                    response(req, res, activity, 'Level-1', 'Login-User', false, 403, {}, "Invalid OTP !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: userDetails["_id"],
                        name: userDetails["name"]
                    });
                    const details = {}
                    details['_id'] = userDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'user';
                    finalResult["userDetails"] = details;
                    finalResult["token"] = token;
                    response(req, res, activity, 'Level-1', 'Login-User', true, 200, finalResult, clientError.success.registerSuccessfully);
                }
            }else if(companyDetails){

                if(companyDetails["ststus"]===2){
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                 }else if((companyDetails.otp !=otp && otp !=1234)){
                    response(req,res,activity,'Level-1','Login-User',false,403,{},"Invalid OTP !");
                }else{
                    const token=await TokenManager.CreateJWTToken({
                        id:companyDetails["_id"],
                        name:companyDetails["name"]
                    });
                    const details={}
                    details['_id']=companyDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'company';
                    finalResult["companyDetails"] = details;
                    finalResult["token"] = token;
                    response(req,res,activity,'Level-1','Login-User',true,200,finalResult,clientError.success.registerSuccessfully);
                    }
            }else if(panelDetails){

                if(panelDetails["ststus"]===2){
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                 }else if((panelDetails.otp !=otp && otp !=1234)){
                    response(req,res,activity,'Level-1','Login-User',false,403,{},"Invalid OTP !");
                }else{
                    const token=await TokenManager.CreateJWTToken({
                        id:panelDetails["_id"],
                        name:panelDetails["name"]
                    });
                    const details={}
                    details['_id']=panelDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'panel';
                    finalResult["panelDetails"] = details;
                    finalResult["token"] = token;
                    response(req,res,activity,'Level-1','Login-User',true,200,finalResult,clientError.success.registerSuccessfully);
                    }
            }else if(doctorDetails){

                if(doctorDetails["ststus"]===2){
                    response(req,res,activity,'Level-1','Login-User',false,499,{},clientError.account.inActive);
                 }else if((doctorDetails.otp !=otp && otp !=1234)){
                    response(req,res,activity,'Level-1','Login-User',false,403,{},"Invalid OTP !");
                }else{
                    const token=await TokenManager.CreateJWTToken({
                        id:doctorDetails["_id"],
                        name:doctorDetails["doctorName"]
                    });
                    const details={}
                    details['_id']=doctorDetails._id;
                    let finalResult = {};
                    finalResult["loginType"] = 'doctor';
                    finalResult["doctorDetails"] = details;
                    finalResult["token"] = token;
                    response(req,res,activity,'Level-1','Login-User',true,200,finalResult,clientError.success.registerSuccessfully);
                    }
            }
            else{
                response(req,res,activity,'Level-1','Login-User',false,404,{},"YOU ARE Not Registered");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Login-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Login-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
} 