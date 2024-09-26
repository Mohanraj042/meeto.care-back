import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Notification, NotificationDocment } from "../model/notification.model";

var activity = "Notification"

/**
 * @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Notification.
 */
export let getAllNotification = async (req, res, next) => {
    try {
        const data = await Notification.find({ isDeleted: false }).populate('from.user', { name: 1, profileImage: 1 }).sort({date: -1}).limit(30);
        response(req, res, activity, 'Level-1', 'GetAll-Notification', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Notification', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
* @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save notification.
 */
export let saveNotification = async (data) => {
    try {
        const notificationDetails: NotificationDocment = data;
        let date = new Date();
        notificationDetails.date = date
        const createData = new Notification(notificationDetails);
        let insertData = await createData.save();
    } catch (err: any) {
        console.log(err);

    }
};


/**
* @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Company Notification.
 */
export let getFilterNotification = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        if (req.body.to) {
            andList.push({ 'to.user': req.body.to })
        }
        if(req.body.title){
            andList.push({title:{$in:req.body.title}})
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const notificationList = await Notification.find(findQuery).sort({ date: -1 }).limit(limit).skip(page)  //.populate('from.user', { name: 1, image: 1 })
        const notificationCount = await Notification.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterNotification', true, 200, { notificationList, notificationCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterNotification', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update notification view.
 */
export let updateNotificationView = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let { modifiedOn, modifiedBy } = req.body;
            let updateData = await Notification.updateMany({$and:[{ isViewed:false},{'to.user':req.body.loginId}]}, {
                $set: {
                    isViewed:true,
                    modifiedOn: modifiedOn,
                    modifiedBy:modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-NotificationView', true, 200, updateData, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-NotificationView', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-NotificationView', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Santhosh Khan K
 * @date 27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get unviewed Notification Count.
 */
export let getUnviewedNotification = async (req, res, next) => {
    try {
        const data = await Notification.find({$and:[{ isDeleted: false },{isViewed:false},{'to.user':req.body.loginId}]},{_id:1})
        const result = data.length
        response(req, res, activity, 'Level-1', 'Get-UnviewedNotification', true, 200, result, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-UnviewedNotification', false, 500, {}, errorMessage.internalServer, err.message);
    }
};