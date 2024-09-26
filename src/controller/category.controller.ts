import { validationResult } from 'express-validator';
import { response } from '../helper/commonResponseHandler';
import { errorMessage, clientError } from '../helper/ErrorMessage';
import { Category,CategoryDocument} from '../model/category.model'



var activity = "Category";

/**
 * @author BalajiMurahari
 * @date 29-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is use to Create Category
 */

export const addCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const createCategory: CategoryDocument = req.body;
            const createdCategory = new Category(createCategory);
            const insertData = await createdCategory.save();
            response(req, res, activity, 'Level-2', 'Add-Category', true, 200, insertData, clientError.success.fetchedSuccessfully, 'Category added successfully');
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Add-Category', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Add-Category', false, 422, {}, errorMessage.fieldValidation, 'Invalid data in the request');
    }
};

  /**
 * @author BalajiMurahari
 * @date  29-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get the category
 * */

  export const getCategories = async (req, res, next) => {
    try {
      const categories = await Category.find({isDeleted:false});
      response(req, res, activity, 'Level-2', 'Get-Categories', true, 200, categories, clientError.success.fetchedSuccessfully, 'Categories fetched successfully');
    } catch (err: any) {
      response(req, res, activity, 'Level-3', 'Get-Categories', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  /**
 * @author BalajiMurahari
 * @date 29-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get a single Category by ID
 */

export let getCategoryById = async (req, res, next) => {
    try{
        const data = await Category.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-2', 'Get-Category', true, 200, data, clientError.success.fetchedSuccessfully, 'Category fetched successfully');
    }catch(err:any){
        response(req, res, activity, 'Level-3', 'Get-Category', false, 500, {}, errorMessage.internalServer, err.message);
    }
    }


    /**
 * @author BalajiMurahari
 * @date 29-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Category
 */

    export const updateCategory = async (req, res, next) => {
        try{
            const categoryData : CategoryDocument = req.body;
            const updateData = await Category.findByIdAndUpdate({_id:req.body._id},{
                $set:{
                    categoryName : categoryData.categoryName,
                    categoryImage : categoryData.categoryImage,
                 
                }
        })
        response(req, res, activity, 'Level-2', 'Update-Category', true, 200, updateData, clientError.success.fetchedSuccessfully, 'Category updated successfully');
        }catch(err:any){
            response(req, res, activity, 'Level-3', 'Update-Category', false, 500, {}, errorMessage.internalServer, err.message);
        }
            
        };
    

 /**
 * @author BalajiMurahari
 * @date 29-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Category
 */
export let deleteCategory = async (req, res, next) => {
    try{
        let id = req.query._id;
        let {modifiedBy,modifiedOn} = req.body;
        const data = await Category.findByIdAndUpdate({_id:id},
            {$set:{isDeleted:true,
             modifiedBy:modifiedBy,
             modifiedOn:modifiedOn
    }
});
response(req, res, activity, 'Level-2', 'Delete-Category', true, 200, data, clientError.success.deleteSuccess);
    }catch(err:any){
        response(req, res, activity, 'Level-3', 'Delete-Category', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author BalajiMurahari
 * @date   01-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Filtered Category
 */


export let getFilteredCategory = async (req, res, next) => {
    try {

        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if(req.body.categoryName){
            andList.push({categoryName:req.body.categoryName})
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const CategoryList = await Category.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const CategoryCount = await   Category.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterCategory', true, 200, { CategoryList, CategoryCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterCategory', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




