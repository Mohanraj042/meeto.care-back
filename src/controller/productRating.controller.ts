import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { ProductRating ,ProductRatingDocument} from "../model/productRating.model";


var activity = "ProductRating"


/**
 *  
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create product rating
 */
export let saveProductRating = async (req, res, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const productRatingDetails: ProductRatingDocument = req.body;
            const createData = new ProductRating(productRatingDetails);
            const insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Save-ProductRating', true, 200, insertData, clientError.success.savedSuccessfully);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-ProductRating', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-ProductRating', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all product rating
 */
export let getAllProductRating = async (req, res, next: any) => {
    try {
        const productRatingDetails = await ProductRating.find({isDeleted: false}).sort({ createdAt: -1 }).populate('userId',{name:1,profileImage:1}).populate('productId',{productName:1});
        response(req, res, activity, 'Level-2', 'Get-All-ProductRating', true, 200, productRatingDetails, clientError.success.fetchedSuccessfully);   
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-ProductRating', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 *  
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get Single product rating
 */
export let getSingleProductRating = async (req, res, next: any) => {
    try {
        const productRatingDetails = await ProductRating.findOne({ _id: req.query._id }).populate('userId',{name:1,profileImage:1}).populate('productId',{productName:1}).populate('panelId',{companyName:1}).populate('companyId',{companyName:1});
        response(req, res, activity, 'Level-2', 'Get-Single-ProductRating', true, 200, productRatingDetails, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-ProductRating', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 *  
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete product rating
 */
export let deleteProductRating = async (req, res, next: any) => {
   try{
     const {modifiedBy} = req.body
       const productRatingDetails = await ProductRating.findOneAndUpdate({ _id: req.query._id }, {
         $set: {
             isDeleted: true,
             modifiedOn: Date.now(),
             modifiedBy: modifiedBy
            } });
       response(req, res, activity, 'Level-2', 'Delete-ProductRating', true, 200, productRatingDetails, clientError.success.deleteSuccess);
   }
   catch(err: any){
       response(req, res, activity, 'Level-3', 'Delete-ProductRating', false, 500, {}, errorMessage.internalServer, err.message);
   }
}


/**
 *  
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update product rating
 */
export let updateProductRating = async (req, res, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const productRatingDetails: ProductRatingDocument = req.body;
            const updateData = await ProductRating.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    title: productRatingDetails.title,
                    comment: productRatingDetails.comment,
                    rating: productRatingDetails.rating,
                    modifiedOn: Date.now(),
                    modifiedBy: req.user._id
                } });
            response(req, res, activity, 'Level-2', 'Update-ProductRating', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-ProductRating', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-ProductRating', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 *  
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter product rating
 */

export let getFilterProductRating = async (req, res, next) => {
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
        if(req.body.productId){
          andList.push({productId:req.body.productId})
        }
        if(req.body.panelId){
          andList.push({panelId:req.body.panelId})
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const productRatingList = await ProductRating.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('userId',{name:1,profileImage:1}).populate('productId',{productName:1}).populate('panelId',{companyName:1}).populate('companyId',{companyName:1});
        const productRatingCount = await   ProductRating.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterAppointment', true, 200, { productRatingList, productRatingCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterAppointment', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


/**
 *  
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get panel ratings
 */

  export const getPanelRatings = async (req, res,next) => {
    try {
  
      const panelRating = await ProductRating.find({panelId:req.query.panelId,isDeleted:false}).populate('userId',{name:1,profileImage:1}).populate('productId',{productName:1}).limit(10).sort({ createdAt: -1 }).skip(0); 
      response(req, res, activity, 'Level-1', 'Get-PanelRatings', true, 200, panelRating, clientError.success.fetchedSuccessfully);
    } catch (err:any) {
     response(req, res, activity, 'Level-3', 'Get-PanelRatings', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };