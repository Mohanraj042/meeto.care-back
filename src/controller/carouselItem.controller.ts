import { validationResult } from 'express-validator';
import { response } from '../helper/commonResponseHandler';
import { errorMessage, clientError } from '../helper/ErrorMessage';
import  { CarouselItem, CarouselItemDocument } from '../model/carouselItem.model';


var activity = "Carousel";

/**
 * @author BalajiMurahari
 * @date  28-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to manage the carousel items
 * */

export const addCarouselItem = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const createCarouselItem : CarouselItemDocument = req.body;
            const createdata = new CarouselItem(createCarouselItem);
            const insertData = await createdata.save();
            response(req, res, activity, 'Level-2', 'Add-Carousel-Item', true, 200, insertData, clientError.success.fetchedSuccessfully, 'Carousel item added successfully');
        }catch(err:any){
            response(req, res, activity, 'Level-3', 'Add-Carousel-Item', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else
    {
        response(req, res, activity, 'Level-3', 'Add-Carousel-Item', false, 422, {}, errorMessage.fieldValidation, 'Invalid data in the request');
    }
}

  /**
 * @author BalajiMurahari
 * @date  28-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get the carousel items
 * */


  export const getCarouselItems = async (req, res, next) => {
    try {
      const carouselItems = await CarouselItem.find({isDeleted:false});
      response(req, res, activity, 'Level-2', 'Get-Carousel-Items', true, 200, carouselItems, clientError.success.fetchedSuccessfully, 'Carousel items fetched successfully');
    } catch (err:any) {
      response(req, res, activity, 'Level-3', 'Get-Carousel-Items', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };

  /**
 * @author BalajiMurahari
 * @date 28-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update Carousel
 */

  export let updateCarousel = async (req, res, next) => {
      try{
        const carouselData : CarouselItemDocument = req.body;
        const updateData = await CarouselItem.findByIdAndUpdate({_id:req.body._id}, {
            $set:{
                title:carouselData.title,
                content:carouselData.content,
                image:carouselData.image,
                modifiedBy:carouselData.modifiedBy,
                modifiedOn:carouselData.modifiedOn
              
            }
      })
      response(req, res, activity, 'Level-2', 'Update-Carousel', true, 200, updateData, clientError.success.updateSuccess);
  }catch(err:any){
      response(req, res, activity, 'Level-3', 'Update-Carousel', false, 500, {}, errorMessage.internalServer, err.message);
  }
  }


  /**
 * @author BalajiMurahari
 * @date 28-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Carousel
 */

  export let deleteCarousel = async (req, res, next) => {
      try{
   let {modifiedBy,modifiedOn} = req.body;
   const data = await CarouselItem.findByIdAndUpdate({ _id:req.query._id }, {
       $set:{
           isDeleted:true,
           modifiedBy:modifiedBy,
           modifiedOn:modifiedOn
       }
   })
   response(req, res, activity, 'Level-2', 'Delete-Carousel', true, 200, data, clientError.success.deleteSuccess);
}catch(err:any){
    response(req, res, activity, 'Level-3', 'Delete-Carousel', false, 500, {}, errorMessage.internalServer, err.message);
}
}

 /**
 * @author Santhosh Khan K
 * @date 29-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filtered Carousel
 */

export let getFilteredCarousel = async (req, res, next) => {
    try{
    var findQuery;
    var andList: any = []
    var limit = req.body.limit ? req.body.limit : 0;
    var page = req.body.page ? req.body.page : 0;
    andList.push({isDeleted:false})
    andList.push({status:1})
    if (req.body.title) {
        andList.push({ title: req.body.title })
    }
    if (req.body.content) {
        andList.push({ content: req.body.content })
    }
    if (req.body.image) {
        andList.push({ image: req.body.image })
    }
    findQuery =(andList.length > 0) ? { $and: andList } : {}
    var carouselList = await CarouselItem.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
    var carouselCount = await CarouselItem.find(findQuery).count()
    response(req, res, activity, 'Level-1', 'Get-FilteredCarousel', true, 200, { carouselList, carouselCount }, clientError.success.fetchedSuccessfully);
}
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilteredCarousel', false, 500, {}, errorMessage.internalServer, err.message);
    }  
 
}


 /**
 * @author Santhosh Khan K
 * @date 29-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single Carousel
 */
export let getSingleCarousel = async (req, res, next) => {
    try{
        const carouselData = await CarouselItem.findById({_id:req.query._id});
        response(req, res, activity, 'Level-2', 'Get-Single-Carousel', true, 200, carouselData, clientError.success.fetchedSuccessfully);
    }
    catch(err:any){
        response(req, res, activity, 'Level-3', 'Get-Single-Carousel', false, 500, {}, errorMessage.internalServer, err.message);
    }
}