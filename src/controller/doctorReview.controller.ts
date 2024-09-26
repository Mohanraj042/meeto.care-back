import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { DoctorReview ,DoctorReviewDocument} from "../model/doctorReview.model";


var activity = "DoctorReview"


/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save DoctorReview.
 */
export let saveDoctorReview = async (req, res, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DoctorReviewDetails: DoctorReviewDocument = req.body;
            const createData = new DoctorReview(DoctorReviewDetails);
            const insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Save-DoctorReview', true, 200, insertData, clientError.success.savedSuccessfully);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-DoctorReview', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-DoctorReview', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get All DoctorReview.
 */
export let getAllDoctorReview = async (req, res, next: any) => {
    try {
        const DoctorReviewDetails = await DoctorReview.find({isDeleted: false}).populate('userId',{name:1,profileImage:1}).sort({ createdAt: -1 });
        response(req, res, activity, 'Level-2', 'Get-All-DoctorReview', true, 200, DoctorReviewDetails, clientError.success.fetchedSuccessfully);   
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-DoctorReview', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Single DoctorReview.
 */
export let getSingleDoctorReview = async (req, res, next: any) => {
    try {
        const DoctorReviewDetails = await DoctorReview.findOne({ _id: req.query._id }).populate('doctorId',{doctorName:1}).populate('userId',{name:1});
        response(req, res, activity, 'Level-2', 'Get-Single-DoctorReview', true, 200, DoctorReviewDetails, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-DoctorReview', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete DoctorReview.
 */
export let deleteDoctorReview = async (req, res, next: any) => {
   try{
       const DoctorReviewDetails = await DoctorReview.findOneAndUpdate({ _id: req.query._id }, {
         $set: {
             isDeleted: true,
             modifiedOn: Date.now(),
             modifiedBy: req.user._id 
            } });
       response(req, res, activity, 'Level-2', 'Delete-DoctorReview', true, 200, DoctorReviewDetails, clientError.success.deleteSuccess);
   }
   catch(err: any){
       response(req, res, activity, 'Level-3', 'Delete-DoctorReview', false, 500, {}, errorMessage.internalServer, err.message);
   }
}

/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update DoctorReview.
 */

export let updateDoctorReview = async (req, res, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DoctorReviewDetails: DoctorReviewDocument = req.body;
            const updateData = await DoctorReview.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    title: DoctorReviewDetails.title,
                    comment: DoctorReviewDetails.comment,
                    rating: DoctorReviewDetails.rating,
                    modifiedOn: Date.now(),
                    modifiedBy: req.user._id
                } });
            response(req, res, activity, 'Level-2', 'Update-DoctorReview', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-DoctorReview', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-DoctorReview', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


  /**
 * @author Santhosh Khan K
 * @date   03-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get DoctorReviews.
 */
export const getDoctorReviews = async (req, res,next) => {
    try {
  
      const userAppointments = await DoctorReview.find({doctorId:req.query.doctorId,isDeleted:false}).populate('userId').sort({ createdAt: -1 }).skip(0); 
      response(req, res, activity, 'Level-1', 'Get-UserAppointments', true, 200, userAppointments, clientError.success.fetchedSuccessfully);
    } catch (err:any) {
     response(req, res, activity, 'Level-3', 'Get-UserAppointments', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  /**
 * @author Santhosh Khan K
 * @date   03-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Filter DoctorReview.
 */
export let getFilterDoctorReview = async (req, res, next) => {
    try {
  
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if(req.body.doctorId){
          andList.push({doctorId:req.body.doctorId})
        }
        if(req.body.userId){
          andList.push({userId:req.body.userId})
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const reviewList = await DoctorReview.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('doctorId',{doctorName:1}).populate("userId",{name:1})
        const reviewCount = await   DoctorReview.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterDoctorReview', true, 200, { reviewList, reviewCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterDoctorReview', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };