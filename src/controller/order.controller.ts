import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response,generateOrderNumber,generateTrackingNumber,generateInvoiceNumber,generateInvoice,getCouponAmount ,removeOrderFromUserPage} from "../helper/commonResponseHandler";
import { Order,OrderDocument } from "../model/order.model";
import { Coupon} from "../model/coupon.model";
import {Product,ProductDocument} from "../model/product.model";
import {DateTime} from 'luxon'
import { saveNotification } from "../controller/notification.controller";

var activity = "Order";

/** 
 *  @author Santhosh Khan K
 *  @date   14-10-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to save Order
 * */

export let saveOrder = async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      const orderDetails: OrderDocument = req.body;
      const { couponCode, userId } = orderDetails;
      let isCouponUsed = false; // Flag to track whether the coupon has been used   
      if (couponCode) {   // Check if the coupon has already been used by the user 
        const existingCouponUsage = await Coupon.findOne({ userId, couponCode });
        if (existingCouponUsage) {
           response(req, res, activity, 'Level-3', 'Save-Order', false, 422, {}, errorMessage.fieldValidation, errorMessage.couponCodeAlreadyUsed);
        }
      }
      const orderNumber = generateOrderNumber();
      orderDetails.orderNumber = orderNumber;
      orderDetails.products.forEach(product => {
        const trackingNumber = generateTrackingNumber();
        product.trackingNumber = trackingNumber;
      });
      if (couponCode) {
        const existingCouponUsage = await Coupon.findOne({ userId, couponCode }); // Check again for coupon usage after the initial check
        if (existingCouponUsage) {  
          if (isCouponUsed = true) {  // Set the flag to true if the coupon has been used
          response(req, res, activity, 'Level-3', 'Save-Order', false, 422, {}, errorMessage.fieldValidation, errorMessage.couponCodeAlreadyUsed);
          }
        }
        if (!isCouponUsed && couponCode.length >= 4) {
          const lastFourDigits = couponCode.slice(-4);
          const discountPerProduct = parseInt(lastFourDigits) / orderDetails.products.length;

          orderDetails.products.forEach((product) => {
            product.discountedPrice -= discountPerProduct;
          });
        }
      }

      let totalPrice = orderDetails.products.reduce((total, product) => total + product.discountedPrice, 0);
      orderDetails.deliveryCharges = totalPrice >= 499 ? 0 : 50;
      orderDetails.totalAmount = totalPrice + orderDetails.deliveryCharges;

      const currentTime = DateTime.utc().setZone('Asia/Kolkata');
      orderDetails.orderPlacedOn = currentTime.toISO();
      const invoiceNumber = generateInvoiceNumber();
      orderDetails.invoiceNumber = invoiceNumber.toString();

      const invoice = await generateInvoice(orderDetails, invoiceNumber);

      for (const product of orderDetails.products) { // Update product quantities in the database
        const existingProduct = await Product.findById(product.productId);
        if (existingProduct) {
          existingProduct.quantity -= product.quantity;
          await existingProduct.save();
        }
      }
      orderDetails.products.forEach((product) => {
        product.invoice = invoice.toString();
      });

      const createData = new Order(orderDetails);
      const insertedData = await createData.save();

      if (couponCode && !isCouponUsed) {
        const newCouponUsage = new Coupon({ userId, couponCode });
        await newCouponUsage.save();
      }

      response(req, res, activity, 'Level-2', 'Save-Order', true, 200, { insertedData, invoiceNumber }, clientError.success.savedSuccessfully);
    } catch (err) {
      if (!res.headersSent) {
       response(req, res, activity, 'Level-3', 'Save-Order', false, 500, {}, errorMessage.internalServer, err.message);
      }
    }
  } else {
     response(req, res, activity, 'Level-3', 'Save-Order', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
  }
};




/**
 *  
 *  @author Santhosh Khan K
 *  @date   14-10-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to get all orders
 * */

export let getAllOrder = async (req, res, next) => {
    try{
        const orderDetails = await Order.find({isDeleted: false}).sort({createdAt: -1}).populate({path: 'products.panelId', select: 'companyName',}).populate({path: 'products.companyId', select: 'companyName',});
        response(req, res, activity, 'Level-2', 'Get-All-Order', true, 200, orderDetails, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-Order', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * 
 * @author Santhosh Khan K
 * @date   14-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to delete order
 * */

export let deleteOrder = async (req, res, next) => {
    try{
        let {modifiedOn,modifiedBy} = req.body;
        const order = await Order.findOneAndUpdate({ _id: req.query._id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy
            }
        });
        response(req, res, activity, 'Level-2', 'Delete-Order', true, 200, order, clientError.success.deleteSuccess);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Order', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * 
 * @author Santhosh Khan K
 * @date   14-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to update order
 * */

export let updateOrder = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const orderDetails: OrderDocument = req.body;
            const updateData = await Order.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    modifiedOn: orderDetails.modifiedOn,
                    modifiedBy: orderDetails.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Order', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Order', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Order', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * 
 * @author Santhosh Khan K
 * @date   14-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get order
 * */

export let getSingleOrder = async (req, res, next) => {
    try{
        const orderDetails = await Order.findOne({ _id: req.query._id }).populate({path: 'products.panelId', select: 'companyName',}).populate({path: 'products.companyId', select: 'companyName',})
        response(req, res, activity, 'Level-2', 'Get-Order', true, 200, orderDetails, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Order', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

/**
 * 
 * @author Santhosh Khan K
 * @date   26-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to cancel order
 * */

export let cancelOrReturnOrder = async (req, res, next) => {

  const orderDetails:OrderDocument=req.body;
  const { orderNumber, trackingNumber, productStatus } = req.body;
  if (!orderNumber || !trackingNumber || !productStatus) {
    response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Please provide orderNumber, trackingNumber, and action');
  }
  try {
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      if(!res.headersSent){
      response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 404, {}, errorMessage, 'Order not found');
    }
  }
    const product = order.products.find((product) => product.trackingNumber === trackingNumber);
    if (!product) {
      if(!res.headersSent){
      response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 404, {}, errorMessage, 'Product not found');
    }}
 
    // Check if the order is already canceled or returned
    if (product.productStatus === 'canceled') {
      if(!res.headersSent){
        response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Order already canceled'); 
      }  
    }
    if (productStatus === 'cancel') {
      if (product.canceled) {
        // If the return order is completed, disallow canceling
        response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Cannot cancel a returned order');
      } else {
        product.productStatus = 'canceled';
        product.canceled = true;
      }
    } else if (productStatus === 'return') {
      if (product.canceled) {
        if(!res.headersSent){
          response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Cannot initiate return for a canceled order');
        }
      }else if (product.returned) {
        if(!res.headersSent){
          response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Cannot initiate return for a returned order');
        }
      }
       else {
        product.productStatus = 'returned';
        product.returned = true;
      }
    } else {
      if(!res.headersSent){
      response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Invalid action');
    }}
 
    await order.save();
    response(req, res, activity, 'Level-3', 'Cancel-Return-Order', true, 200, order, clientError.success.updateSuccess);

       setTimeout(async () => {
      const now = new Date().toISOString();
      const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
      const cancellationTime = new Date(orderDetails.cancellationTime).getTime() || 0;
      const currentTime = new Date(now).getTime();
      if (currentTime - cancellationTime >= threeDaysInMillis) {
        await removeOrderFromUserPage(order);
      }
    }, 3 * 24 * 60 * 60 * 1000);
  } catch (err) {
    if(!res.headersSent){
    response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 500, {}, errorMessage.internalServer, err.message);
  }}
};


/**
 *  
 *  @author Santhosh Khan K
 *  @date   26-10-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to track order
 * */

export let trackOrderNumber = async (req, res, next) => {
    try {
      const { orderNumber } = req.body;
      const order = await Order.findOne({ orderNumber});
  
      if (!order) {
      response(req, res, activity, 'Level-3', 'Track-Order', false, 404, {}, errorMessage, 'Order not found');
      }
      response(req, res, activity, 'Level-2', 'Track-Order', true, 200, order, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
      response(req, res, activity, 'Level-3', 'Track-Order', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };
  

  /**
 *  
 *  @author Santhosh Khan K
 *  @date   26-10-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to track order
 * */

export let trackTrakingNumber = async (req, res, next) => {
    try {
      const { trackingNumber } = req.body;
      const order = await Order.findOne({ trackingNumber });
  
      if (!order) {
      response(req, res, activity, 'Level-3', 'Track-Order', false, 404, {}, errorMessage, 'Order not found');
      }
      response(req, res, activity, 'Level-2', 'Track-Order', true, 200, order, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
      response(req, res, activity, 'Level-3', 'Track-Order', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };

  /**
 * @author Santhosh Khan K
 * @date   27-10-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Filtered Order
 */

export let getFilteredOrder = async (req, res, next) => {
  try {

      var findQuery;
      var andList: any = []
      var limit = req.body.limit ? req.body.limit : 0;
      var page = req.body.page ? req.body.page : 0;
      andList.push({ isDeleted: false })
      andList.push({ status: 1 })
      if(req.body.panelId){
          andList.push({panelId:req.body.panelId})
      }
      if(req.body.userId){
          andList.push({userId:req.body.userId})
      }
      if (req.body.orderNumber) {
          andList.push({ orderNumber: { orderNumber: req.body.orderNumber } })
      }
      if (req.body.trackingNumber) {
          andList.push({ trackingNumber: req.body.trackingNumber })
      }
      if (req.body.orderStatus) {
          andList.push({ orderStatus: req.body.orderStatus })
      }
      findQuery = (andList.length > 0) ? { $and: andList } : {}
      const orderList = await Order.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
      const orderCount = await Order.find(findQuery).count()
      response(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { orderList, orderCount }, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
      response(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, errorMessage.internalServer, err.message);
  }
};


  /**
 *  
 *  @author Santhosh Khan K
 *  @date   30-10-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to update order status
 * */

  export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId, newStatus } = req.body;
        const order = await Order.findOneAndUpdate(
            { 'products._id': orderId },
            { $set: { 'products.$.orderStatus': newStatus } },
            { new: true }
        );
        if (!order) {
            response(req, res, activity, 'Level-3', 'Update-Order-Status', false, 404, {}, errorMessage.internalServer, 'Order not found');
        }
        response(req, res, activity, 'Level-2', 'Update-Order-Status', true, 200, order, clientError.success.updateSuccess);
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Update-Order-Status', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


  /**
 *  
 *  @author Santhosh Khan K
 *  @date   21-11-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to update order payment status
 * */

export let updateOrderPaymentStatus = async (req, res, next) => {
  try {
    const { orderId, newStatus } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: newStatus }, { new: true });

    if (!order) {
    response(req, res, activity, 'Level-3', 'Update-Order-Payment-Status', false, 404, {}, errorMessage.internalServer, 'Order not found');
    }

    response(req, res, activity, 'Level-2', 'Update-Order-Payment-Status', true, 200, order, clientError.success.updateSuccess);
  } catch (err:any) {
    response(req, res, activity, 'Level-3', 'Update-Order-Payment-Status', false, 500, {}, errorMessage.internalServer, err.message);
  }
};







