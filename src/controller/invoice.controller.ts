import { validationResult } from "express-validator";
import { response } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { Order, OrderDocument } from "../model/order.model";


var activity = 'Invoice';

/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Invoice Number.
 */
export let getInvoiceNumber = async (req, res, next) => {
    try {
        const data = await Order.find({ isDeleted: false }).populate('products.panelId',{name:1,companyName:1,email:1,city:1,state:1,mobileNumber:1,companyAddress:1,}).populate('products.companyId',{name:1,companyName:1,email:1,city:1,state:1,mobileNumber:1,companyAddress:1,});
        response(req, res, activity, 'Level-1', 'GetInvoice-Number', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetInvoice-Number', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Invoice.
 */
export let getAllInvoice = async (req, res, next) => {
    try {
        const data = await Order.find({ isDeleted: false }).populate('products.panelId',{name:1,companyName:1,email:1,city:1,state:1,mobileNumber:1,companyAddress:1,}).populate('products.companyId',{name:1,companyName:1,email:1,city:1,state:1,mobileNumber:1,companyAddress:1,});
        response(req, res, activity, 'Level-1', 'GetAll-Invoice', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save invoice.
//  */

export let generateInvoiceCopy = async (req, res, next) => {
    try {
        const orderData: OrderDocument = req.body;
        const invoice = {
            orderNumber: orderData.orderNumber,
            totalAmount: orderData.totalAmount,
        };
        response(req, res, activity, 'Level-1', 'Generate-Invoice', true, 200, invoice, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Generate-Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Invoice.
//  */
export let updateInvoice = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails: OrderDocument = req.body;
            const updateInvoice = new Order(invoiceDetails)
            let updateData = await updateInvoice.updateOne({
                $set: {
                    orderNumber: invoiceDetails.orderNumber,
                    totalAmount: invoiceDetails.totalAmount,
                    modifiedOn: invoiceDetails.modifiedOn,
                    modifiedBy: invoiceDetails.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Invoice', true, 200, updateData, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Invoice', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Invoice', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Santhosh Khan K
 * @date 27-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Invoice.
 */
export let deleteInvoice = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await Order.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        })
        response(req, res, activity, 'Level-2', 'Delete-Invoice', true, 200, data, clientError.success.deleteSuccess)
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Invoice', true, 500, {}, errorMessage.internalServer, err.message)
    }
};



/**
 * @author Santhosh Khan K
 * @date 20-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single invoice.
 */
export let getSingleInvoice = async (req, res, next) => {
    try {
        const data = await Order.findById({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'Get-SingleInvoice', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleInvoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

 /**
 * @author Santhosh Khan K
 * @date 20-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter invoice.
 */
export let getFilterInvoice = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const invoiceList = await Order.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('client',{name:1}).populate('project',{title:1}).populate('resource',{projectTitle:1})
        const invoiceCount = await Order.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterInvoice', true, 200, { invoiceList, invoiceCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterInvoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

 /**
 * @author Santhosh Khan K
 * @date 20-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to generate invoice.
 */



export const generateInvoice = async (req,res,next) => {
  try {
    const orderData: OrderDocument = req.body;

    const invoice = {
      orderNumber: orderData.orderNumber,
      totalAmount: orderData.totalAmount,
    };

    response(req, res, activity, 'Level-1', 'Generate-Invoice', true, 200, invoice, clientError.success.fetchedSuccessfully);
  } catch (err:any) {
    response(req, res, activity, 'Level-3', 'Generate-Invoice', false, 500, {}, errorMessage.internalServer, err.message);
  }
};
