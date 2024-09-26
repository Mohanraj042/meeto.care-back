import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { PanelReview ,PanelReviewDocument} from "../model/panelReview.model";


var activity = "PanelReview"


/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save PanelReview.
 */
export let savePanelReview = async (req, res, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const panelReviewDetails: PanelReviewDocument = req.body;
            const createData = new PanelReview(panelReviewDetails);
            const insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Save-PanelReview', true, 200, insertData, clientError.success.savedSuccessfully);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-PanelReview', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-PanelReview', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get All PanelReview.
 */
export let getAllPanelReview = async (req, res, next: any) => {
    try {
        const panelReviewDetails = await PanelReview.find({isDeleted: false}).sort({ createdAt: -1 }).populate('panelId',{companyName:1,profileImage:1});
        response(req, res, activity, 'Level-2', 'Get-All-PanelReview', true, 200, panelReviewDetails, clientError.success.fetchedSuccessfully);   
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-PanelReview', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Single PanelReview.
 */
export let getSinglePanelReview = async (req, res, next: any) => {
    try {
        const panelReviewDetails = await PanelReview.findOne({ _id: req.query._id }).populate('panelId',{companyName:1})
        response(req, res, activity, 'Level-2', 'Get-Single-PanelReview', true, 200, panelReviewDetails, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-PanelReview', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete PanelReview.
 */
export let deletePanelReview = async (req, res, next: any) => {
   try{
    const {modifiedBy,modifiedOn} = req.body;
       const panelReviewDetails = await PanelReview.findOneAndUpdate({ _id: req.query._id }, {
         $set: {
             isDeleted: true,
             modifiedOn: Date.now(),
             modifiedBy: modifiedBy
            } });
       response(req, res, activity, 'Level-2', 'Delete-PanelReview', true, 200, panelReviewDetails, clientError.success.deleteSuccess);
   }
   catch(err: any){
       response(req, res, activity, 'Level-3', 'Delete-PanelReview', false, 500, {}, errorMessage.internalServer, err.message);
   }
}

/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update PanelReview.
 */

export let updatePanelReview = async (req, res, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const panelReviewDetails: PanelReviewDocument = req.body;
            const updateData = await PanelReview.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    title: panelReviewDetails.title,
                    comment: panelReviewDetails.comment,
                    rating: panelReviewDetails.rating,
                    modifiedBy:panelReviewDetails.modifiedBy,
                    modifiedOn: Date.now()
                } });
            response(req, res, activity, 'Level-2', 'Update-PanelReview', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-PanelReview', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-PanelReview', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Santhosh Khan K
 * @date   02-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Filter PanelReview.
 */

export let getFilterPanelReview = async (req, res, next) => {
    try {
  
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
         if(req.body.userId){
          andList.push({userId:req.body.userId})
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const panelReviewList = await PanelReview.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('panelId',{companyName:1})
        const panelReviewCount = await   PanelReview.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPanelReview', true, 200, { panelReviewList, panelReviewCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPanelReview', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };