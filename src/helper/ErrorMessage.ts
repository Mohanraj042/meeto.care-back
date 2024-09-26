import { bookAppointment } from "src/controller/doctorAppoiment.controller";

export let ErrorMessage = {
    email: {
        required: 'Field is Required',
        validation: 'Not a Valid Email'
    },
    name: {
        required: 'Field is Required',
        validation: 'Not a Valid Name'
    },
    mobileNumber: {
        required: 'Field is Required',
        validation: 'Not a Valid Mobile Number'
    },
    password: {
        required: 'Field is Required',
        validation: 'Not a Valid Password'
    },
    id: {
        required: 'Field is Required',
        validation: 'Not a Valid Id'
    },
    general: {
        required: 'Field is Required',
        validation: 'Not a valid value'
    }
}


export let responseErrors = {
    200: 'OK',
    201: 'Successfully created',
    204: 'No content Found',
    400: 'Bad Request',
    401: 'Invalid credentials',
    403: 'Forbidden',
    402: 'Email not found',
    422: 'Validation failed',
};


// export let errorMessage = {
//     internalServer: 'Internal Server Error',
//     fieldValidation: 'Field Validation Failed',
//     cantdelete: 'Cannot Delete as it is already in use !',
//     cantChangestatus: 'Cannot Change the Status'
    


export const errorMessage = { // Modify the errorMessage object to fix the typo
    internalServer: "Internal server error",
    fieldValidation: "Field validation error",
    cantDelete: "Unable to delete",
    cantChangeStatus: "Unable to change status",
    notFound: "Not found",
    addSuccess:'Item added successfully',
    updateSuccess:'Item updated successfully',
    deleteSuccess:'Item deleted successfully',
    alreadyExist:'Already Exist',
    couponAlreadyExist:'Coupon Already Exist',
    appointmentAlreadyBooked: 'Sorry, the selected time slot is already booked. Please choose another slot.',
    couponExpired: 'Coupon has expired. Please enter a valid coupon code.',
    couponNotValid: 'Coupon is not valid. Please enter a valid coupon code.',
    couponCodeAlreadyUsed: 'Coupon code has already been used. Please enter a different coupon code.',
};






/** 
 * @author Santhosh Khan K
 * @description All the Error messages that needed to be sent to User
 * @type {Object}
*/
export let clientError = Object.freeze({
    user: {
        userNameExist: 'User already exist for given username, Please use the different one',
        userNameNotExist: 'User does not Exist for User Name',
        UserNotFound: 'You are not registered with us !',
        userDontExist: 'User does not exist',
        userExist: 'User already exist !',
    },
    email: {
        emailExist: 'User already exist for given email',
        emailSend: 'Email Send Successfully',
        emailNotVerified: 'Your email is not verified !',
        emailUserNotFound: 'Invalid Email !',
        VerificationEmailLinkSendSuccess: "Verification link has been send to your email address.",
        password: "Invalid Password !",
    },
    mobile: {
        mobileExist: "User already exist for given mobile number",
        mobileNotExist: "No User found for this mobile number",
        alreadyVerifiedEmail: "Your Email is already verified!",
        phoneNotVerified: 'Your email is not verified !',
    },
    password: {
        invalidPassword: 'Invalid Password !',
    },
    otp: {
        OTPText: 'This is your OTP Dont share with anyone',
        otpSent: 'OTP has been sent successfully',
        otpExpired: 'Entered OTP has been expired',
        otpDoestMatch: 'Invalid OTP',
        otpVerifySuccess: 'OTP is successfully verified',
        changePasswod: 'Current password is wrong..!',
    },
    success: {
        savedSuccessfully: 'Saved Successfully',
        replySentSuccessfully:'Reply Sent Successfully',
        deleteSuccess: "Deleted successfully",
        updateSuccess: "Updated successfully",
        registerSuccessfully: 'Registration successful! Please log in now.',
        loginSuccess: 'You have successfully Logged-in',
        passwordUpdateSuccess: 'Password has been updated Successfully',
        passwordNotUpdateSuccess: 'Password has not been updated !',
        success: "Everything is fine",
        exist: 'Already exist !',
        accountNumberExist: 'AccountNumber Already Exist !',
        dateExist: 'Date Already Exist !',
        emailExist: 'Email already exist !',
        mobileExist: 'Mobile already exist !',
        nameExist: 'Name already exist !',
        fetchedSuccessfully: 'Fetched Successfully !',
        sendSuccessfully: 'Send Successfully',
        operationSuccessfully: 'Operation Successfully',
        addedSuccessfully: 'Added Successfully',
        couponUsedSuccessfully: 'Coupon used successfully',
        couponCreatedSuccessfully: 'Coupon created successfully',
        couponFetchedSuccessfully: 'Coupon fetched successfully',

    },
    account: {
        deActive: 'Your account is deactived',
        inActive: 'Your account is blocked',
        inActiveStatus: 'Your account is inactive, Please check your email ',
        inActiveStatuss: 'Your account is inactive, Please Renewal your package ',
        isExpied: 'Your plan is expired, Please Renewal your package',
        verification: 'Your account is not active, Please check your email ',
        loggedOut: 'You have been Successfully logged out',
    },
    token: {
        tokenExpire: 'Your Token has been Expired',
        tokenUserd: 'Your Token is already used',
        sessionExpire: 'Session Expired!',
        unauthRoute: 'User is not authorized to Access the resource',
    },

    code: {
        successCode: 200
    }
});
