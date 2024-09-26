import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response,generateCouponCode,scheduleNextCouponGeneration,isSameDay } from "../helper/commonResponseHandler";
import { Coupon,CouponDocument } from "../model/coupon.model";

var activity = "Coupon";

/**
* @author Santhosh Khan K / BalajiMurahari
* @date   05-12-2023
* @param {Object} req 
* @param {Object} res 
* @param {Function} next  
* @description This Function is used to create coupon.
*/
export const createCoupon = async (req, res, next) => {
  try {
    const lastCoupon = await Coupon.findOne({}, {}, { sort: { 'createdOn': -1 } });
    
    if (lastCoupon && isSameDay(new Date(), lastCoupon.createdOn)) {
      response(req, res, activity, 'Level-2', 'Create-Coupon', false, 400, {}, 'Coupon for today already exists.');
      return; // Exit early if coupon for today already exists
    }

    const existingCoupon = await Coupon.findOne({
      validFrom: { $lte: new Date() },
      validTill: { $gte: new Date() },
    });

    if (existingCoupon) {
      response(req, res, activity, 'Level-2', 'Create-Coupon', false, 400, {}, 'Coupon for the current day already exists.');
      return; // Exit early if coupon for the current day already exists
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const couponCode = generateCouponCode();
    const newCoupon = new Coupon({
      code: couponCode,
      validFrom: startOfDay,
      validTill: endOfDay,
    });

    await newCoupon.save();
    response(req, res, activity, 'Level-2', 'Create-Coupon', true, 200, newCoupon, clientError.success.couponCreatedSuccessfully);

    // Schedule the generation of a new coupon after the validTill date
    scheduleNextCouponGeneration(newCoupon.validTill);
  } catch (err: any) {
    if (!res.headersSent) {
      response(req, res, activity, 'Level-3', 'Create-Coupon', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }
};

/**
* @author Santhosh Khan K
* @date   29-01-2024
* @param {Object} req 
* @param {Object} res 
* @param {Function} next  
* @description This Function is used to get coupon for current day .
*/

export const getTodayCoupon = async (req, res, next) => {
  try {
    const todayCoupon = await Coupon.findOne({
      validFrom: { $lte: new Date() },
      validTill: { $gte: new Date() },
    });

    if (!todayCoupon) {
      response(req, res, activity, 'Level-2', 'Get-Today-Coupon', false, 404, {}, 'No coupon found for today.');
    }

    response(req, res, activity, 'Level-2', 'Get-Today-Coupon', true, 200, todayCoupon, 'Coupon found for today.');
  } catch (err: any) {
    if (!res.headersSent) {
      response(req, res, activity, 'Level-3', 'Get-Today-Coupon', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }
};