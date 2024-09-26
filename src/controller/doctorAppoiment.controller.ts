import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response ,generateTicketNumber,sentEmail,getDoctorEmailAddress,getUserEmailAddress} from "../helper/commonResponseHandler";
import { DoctorAppointment,DoctorAppointmentDocument } from "../model/doctorAppoiment.model";
import { saveNotification } from "../controller/notification.controller";
import * as moment from 'moment';

var activity = "DoctorAppoiment";


/**
 * @author Santhosh Khan K
 * @date   17-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Appointment
 */

  export let bookAppointment = async (req, res, next) => {
    try {
      const appointment: DoctorAppointmentDocument = req.body;

      const currentTime = moment();
      const appointmentTime = moment(appointment.scheduleTime);
      const isWithin30Minutes = appointmentTime.isBetween(currentTime, currentTime.clone().add(15, 'minutes'));
  
      if (isWithin30Minutes) {
        response(req, res, activity, 'Level-3', 'Get-Appointment', false, 422, {}, errorMessage.fieldValidation, 'Appointment time must be at least 15 minutes from current time');
      }
  
      const isSlotAvailable = await DoctorAppointment.find({scheduleTime: appointment.scheduleTime,scheduleDate: appointment.scheduleDate,doctorId: appointment.doctorId,scheduleStatus:'scheduled'});
      if (!isSlotAvailable) {
        response(req, res, activity, 'Level-3', 'Get-Appointment', false, 422, {}, errorMessage.fieldValidation, 'Appointment slot is not available');
      }
      if (isSlotAvailable.length === 0){
        appointment.scheduleStatus = 'scheduled';
        const newAppointment = new DoctorAppointment( appointment );
        await newAppointment.save();
        const user = { from: {user:appointment.doctorId,modelType:'Doctor'}, to: {user:appointment.userId,modelType:'User'}, description: 'Booked an appointment for a health care.', title: 'Doctor Appointment' }
            const doctor = { from: {user:appointment.userId,modelType:'User'}, to:{ user:appointment.doctorId,modelType:'Doctor'}, description: `Booked an appointment for a health care..`, title: 'Doctor Appointment' }
            saveNotification(user)
            saveNotification(doctor)

            const userEmailAddress = await getUserEmailAddress(appointment.userId);
            const doctorEmailAddress = await getDoctorEmailAddress(appointment.doctorId);
            await sentEmail(userEmailAddress, 'Appointment Confirmation', 'You have been booked for an appointment.');
            await sentEmail(doctorEmailAddress, 'Appointment Confirmation', 'You have successfully booked your appointment.');
         
        response(req, res, activity, 'Level-2', 'Get-Appointment', true, 200, newAppointment, clientError.success.fetchedSuccessfully);
      } else {
        response(req, res, activity, 'Level-3', 'Get-Appointment', false, 422, {}, errorMessage.fieldValidation,errorMessage.appointmentAlreadyBooked);
      }
    } catch (err: any) {
      response(req, res, activity, 'Level-3', 'Get-Appointment', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }

  /**
 * @author Santhosh Khan K
 * @date   17-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get All Appointment
 */

export let getAllAppointment = async (req, res, next) => {
  try {
    const appointments = await DoctorAppointment.find({isDeleted: false}).populate('doctorId',{doctorName:1}).populate('doctorId',{phone:1}).populate('doctorId').sort({ createdAt: -1 })
    response(req, res, activity, 'Level-2', 'Get-Appointment', true, 200, appointments, clientError.success.fetchedSuccessfully);
  } catch (err:any) {
    response(req, res, activity, 'Level-3', 'Get-Appointment', false, 500, {}, errorMessage.internalServer, err.message);
  }
}

/**
 * @author Santhosh Khan K
 * @date   17-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Single Appointment
 */

export let getSingleAppointment = async (req, res, next) => {
  try {
    const appointment = await DoctorAppointment.findById({ _id: req.query._id }).sort({ createdAt: -1 }).limit(1).populate('doctorId',{doctorName:1}).populate('doctorId',{phone:1}).populate('doctorId');
    response(req, res, activity, 'Level-2', 'Get-Appointment', true, 200, appointment, clientError.success.fetchedSuccessfully);
  } catch (err:any) {
    response(req, res, activity, 'Level-3', 'Get-Appointment', false, 500, {}, errorMessage.internalServer, err.message);
  }
}

/**
 * @author Santhosh Khan K
 * @date   15-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Appointment
 */

export let deleteAppointment = async (req, res, next) => {
  try{
       let {modifiedBy,modifiedOn} = req.body;
       const data = await DoctorAppointment.findByIdAndUpdate({ _id:req.body._id }, {
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
 * @date   27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Filter Appointment
 */
export let getFilterAppointment = async (req, res, next) => {
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
      const appointmentList = await DoctorAppointment.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('doctorId',{doctorName:1});
      const appointmentCount = await   DoctorAppointment.find(findQuery).count()
      response(req, res, activity, 'Level-1', 'Get-FilterAppointment', true, 200, { appointmentList, appointmentCount }, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
      response(req, res, activity, 'Level-3', 'Get-FilterAppointment', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

/**
 * @author Santhosh Khan K
 * @date   27-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get User Appointments
 */
export const getUserAppointments = async (req, res,next) => {
  try {

    const userAppointments = await DoctorAppointment.find({userId:req.query.userId,isDeleted:false}).populate('doctorId',{doctorName:1}).populate("doctorId",{phone:1}).populate('doctorId').limit(10).sort({ createdAt: -1 }).skip(0); 
    response(req, res, activity, 'Level-1', 'Get-UserAppointments', true, 200, userAppointments, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
   response(req, res, activity, 'Level-3', 'Get-UserAppointments', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

/**
 * @author Santhosh Khan K
 * @date   28-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Doctor Appointments
 */

export const getDoctorAppointments = async (req, res,next) => {
  try {

    const doctorAppointments = await DoctorAppointment.find({doctorId:req.query.doctorId, isDeleted:false }).populate('userId',).limit(10).sort({ createdAt: -1 }).skip(0); 
    response(req, res, activity, 'Level-1', 'Get-DoctorAppointments', true, 200, doctorAppointments, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
   response(req, res, activity, 'Level-3', 'Get-DoctorAppointments', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

/**
 * @author Santhosh Khan K
 * @date   03-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Appointment Status
 */
export let updatedAppointmentStatus = async (req, res, next) => {
  try {
    const { _id, scheduleStatus } = req.body;

    let appointment = await DoctorAppointment.findById(_id);

    if (!appointment) {
      response(req, res, activity, 'Level-3', 'Update-Appointment-Status', false, 404, {}, errorMessage.notFound, 'Appointment not found');
    }

    if (scheduleStatus === 'confirmed') {
      if (appointment?.scheduleStatus !== 'confirmed') {
        appointment.scheduleStatus = 'confirmed';
        const ticketNumber = generateTicketNumber();
        appointment.ticketNumber = ticketNumber;
        const userNotification = {
          from: { user: appointment?.doctorId, modelType: 'Doctor' },
          to: { user: appointment?.userId, modelType: 'User' },
          description: 'Your appointment has been confirmed',
          title: 'Appointment Confirmed',
        };
        saveNotification(userNotification);

        // Send confirmation emails
        const userEmailAddress = await getUserEmailAddress(appointment.userId);
        const doctorEmailAddress = await getDoctorEmailAddress(appointment.doctorId);
        await sentEmail(userEmailAddress, 'Appointment Confirmation', 'You have been booked for an appointment.');
        await sentEmail(doctorEmailAddress, 'Appointment Confirmation', 'You have successfully booked your appointment.');
      }
    } else if (scheduleStatus === 'rejected') {
      appointment.scheduleStatus = 'rejected';
      const userNotification = {
        from: { user: appointment?.doctorId, modelType: 'Doctor' },
        to: { user: appointment?.userId, modelType: 'User' },
        description: 'Your appointment has been rejected',
        title: 'Appointment Rejected',
      };
      saveNotification(userNotification);

      // Send rejection email
      const userEmailAddress = await getUserEmailAddress(appointment.userId);
      await sentEmail(userEmailAddress, 'Appointment Rejection', 'Your appointment has been rejected.');
    } else if (scheduleStatus === 'completed') {
      appointment.scheduleStatus = 'completed';
      const userNotification = {
        from: { user: appointment?.doctorId, modelType: 'Doctor' },
        to: { user: appointment?.userId, modelType: 'User' },
        description: 'Your appointment has been completed',
        title: 'Appointment Completed',
      };
      saveNotification(userNotification);

      const userEmailAddress = await getUserEmailAddress(appointment.userId);
      await sentEmail(userEmailAddress, 'Appointment Completion', 'Your appointment has been completed.');
    } else {
      response(req, res, activity, 'Level-3', 'Update-Appointment-Status', false, 422, {}, errorMessage.fieldValidation, 'Invalid status provided');
    }

    await appointment.save();

    const doctorNotification = {
      from: { user: appointment?.userId, modelType: 'User' },
      to: { user: appointment?.doctorId, modelType: 'Doctor' },
      description: `Appointment status has been updated to ${scheduleStatus}`,
      title: 'Appointment Status Update',
    };
    saveNotification(doctorNotification);

    response(req, res, activity, 'Level-2', 'Update-Appointment-Status', true, 200, appointment, clientError.success.updateSuccess);
  } catch (err: any) {
    response(req, res, activity, 'Level-3', 'Update-Appointment-Status', false, 500, {}, errorMessage.internalServer, err.message);
  }
};