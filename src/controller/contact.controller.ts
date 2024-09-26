import { Contact,ContactDocument } from "../model/contact.models";
import {response} from "../helper/commonResponseHandler";
import{errorMessage,clientError} from "../helper/ErrorMessage";
import{validationResult} from "express-validator";


var activity = "Contact";

/**
 * @author BalajiMurahari
 * @date 30-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save contact cart
 */

export let saveContact = async (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const createContact: ContactDocument = req.body;
            const createData = new Contact(createContact);
            const insertData = await createData.save();
           
            response(req,res,activity,'Level-2','Save-Contact',true,200,insertData,clientError.success.savedSuccessfully);
        } catch (err:any){
            response(req,res,activity,'Level-3','Save-Contact',false,500,{},errorMessage.internalServer, err.message);
        }
    } else{
        response(req, res, activity,  'Level-3','Save-Contact', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



/**
 * @author Balaji Murahari
 * @date 30-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all contact
 * 
 */
export let getAllUser = async(req,res,next)=>{
    try{
        const data = await Contact.find({isDeleted:false})
        response(req,res,activity,'Level-1','GetAll-User',true,200,data,clientError.success.fetchedSuccessfully)
     } catch(err:any){
        response(req,res,activity,'Level-3','GetAll-User',false,500,{},errorMessage.internalServer,err.message)
    }
}

   /**
 * @author Balaji Murahari
 * @date 30-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get a single Users.
 */
   export let getSingleUsers = async (req, res, next) => {
    try {
        const userData = await Contact.findById({_id:req.query._id})
        response(req,res,activity,'Level-1','Get-SingleUsers',true,200,userData,clientError.success.fetchedSuccessfully)
    } catch (err:any) {
        response(req, res, activity, 'Level-3', 'Get-SingleUsers', false, 500, {}, errorMessage.internalServer, err.message);
        
    }
}

/**
 * @author Balaji Murahari
 * @date 28-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete user .
 */

export let deletedUsers = async (req, res, next) => {
    try {
        let {modifiedBy,modifiedOn} = req.body;
        const usersData = await Contact.findByIdAndUpdate({_id:req.body._id},
            {$set:{isDeleted:true,
             modifiedBy:modifiedBy,
             modifiedOn:modifiedOn
    }});
    response(req, res, activity, 'Level-2', 'Delete-Users', true, 200, usersData, clientError.success.deleteSuccess);
    } catch (error: any) {
        response(req, res, activity, 'Level-3', 'Delete-Users', false, 500, {}, errorMessage.internalServer, error.message);
    }
}

/**
 * @author Balaji Murahari
 * @date 30-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filtered Users.
 */
export let getFilterContact = async (req, res, next) => {
    try {
           var findQuery;
           var andList: any = [];
           var limit = req.body.limit ? req.body.limit : 0;
           var page = req.body.page ? req.body.page : 0;
           andList.push({ isDeleted: false })
           andList.push({ status: 1 })
           andList.push({ user: req.body.loginId })
       if(req.body.name){
          andList.push({ name: req.body.name })
        }
        if(req.body.email){
          andList.push({ email: req.body.email })
        }
        if(req.body.mobileNumber){
          andList.push({ mobileNumber: req.body.mobileNumber })
        }
        if(req.body.messages){
          andList.push({ messages: req.body.messages })
        }
        
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const userList = await Contact.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
        const userCount = await Contact.find(findQuery).count();
        response(req, res, activity, 'Level-2', 'Get-FilterDeveloper', true, 200, {userList,userCount }, clientError.success.fetchedSuccessfully);
       }catch (err: any) {
       response(req, res, activity, 'Level-3', 'Get-FilterDeveloper', false, 500, {}, errorMessage.internalServer, err.message);
      } 
    };
    