import { response } from '../helper/commonResponseHandler';
import { clientError, errorMessage } from '../helper/ErrorMessage';
import { ChatMessage, chatMessageDocument } from '../model/chat.models';
import {DateTime} from 'luxon';

var activity = "chatuser";


/**
 * @author Balaji Murahari/ Santhosh Khan K
 * @date   07-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create chat for users
 */
// export const userSendMessages = async (req, res, next) => {
//   try {
//     const chatDetails = req.body;
//     if (!chatDetails.userId || !chatDetails.doctorId) {
//       response(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both userId and doctorId are required');
//     }
//     if (chatDetails.userId === chatDetails.doctorId) {
//       response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'Cannot send message to yourself');
//     }

//   //   const currentTime = DateTime.utc().setZone('Asia/Kolkata');
//   // chatDetails.sentOn = currentTime.toISO();

//     const senderType = 'user';
//     const newMessage = await ChatMessage.create({
//       userId: chatDetails.userId,
//       doctorId: chatDetails.doctorId,
//       message: chatDetails.message,
//       senderType: senderType,
//       sentOn: chatDetails.sentOn,
//     });
//     const io = req.app.get('socketio');
//     if (io) {
//       io.emit('userStatus', { userId: chatDetails.userId, status: 'online' });
//       io.emit('userStatus', { doctorId: chatDetails.doctorId, status: 'online' });
//     }

//     await newMessage.save();
//     const sentOnTime = new Date(chatDetails.sentOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, {sentOnTime});
//   } catch (err:any) {
//    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
//   }
// };

export const userSendMessages = async (req, res, next) => {
  try {
    const chatDetails = req.body;
    if (!chatDetails.userId || !chatDetails.doctorId) {
      response(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both userId and doctorId are required');
    }
    if (chatDetails.userId === chatDetails.doctorId) {
      response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'Cannot send message to yourself');
    }

    const currentTime = DateTime.now().setZone('Asia/Kolkata');
    chatDetails.sentOn = currentTime.toFormat('hh:mm a');

    const senderType = 'user';
    const newMessage = await ChatMessage.create({
      userId: chatDetails.userId,
      doctorId: chatDetails.doctorId,
      message: chatDetails.message,
      senderType: senderType,
      sentOn: chatDetails.sentOn,
      isSeen:chatDetails.isSeen 
    });

    const io = req.app.get('socketio');
    if (io) {
      io.emit('userStatus', { userId: chatDetails.userId, status: 'online' });
      io.emit('userStatus', { doctorId: chatDetails.doctorId, status: 'online' });
    }

    await newMessage.save();
    const sentOnTime = currentTime.toFormat('hh:mm a')
    response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, { sentOnTime });
  } catch (err: any) {
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

/**
 * @author Balaji Murahari / Santhosh Khan K
 * @date   07-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create chat for doctors
 */

export const doctorSendMessages = async (req, res, next) => {
  try {
    const chatDetails = req.body;
    if (!chatDetails.userId || !chatDetails.doctorId) {
      response(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both userId and doctorId are required');
    }
    if (chatDetails.userId === chatDetails.doctorId) {
      response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'Cannot send message to yourself');
    }

    const currentTime = DateTime.now().setZone('Asia/Kolkata');
    chatDetails.sentOn = currentTime.toFormat('hh:mm a');

    const senderType = 'doctor';
    const newMessage = await ChatMessage.create({
      userId: chatDetails.userId,
      doctorId: chatDetails.doctorId,
      message: chatDetails.message,
      senderType: senderType,
      sentOn: chatDetails.sentOn,
      isSeen:chatDetails.isSeen
    });
    const io = req.app.get('socketio');
    if (io) {
      io.emit('userStatus', { userId: chatDetails.userId, status: 'online' });
      io.emit('userStatus', { doctorId: chatDetails.doctorId, status: 'online' });
    }

    await newMessage.save();
    const sentOnTime = currentTime.toFormat('hh:mm a');
    response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, {sentOnTime});
  } catch (err:any) {
   response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }
};


/**
 * @author Santhosh Khan K
 * @date   23-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get messages
 */


    export const getUserSentChats = async (req, res, next) => {
      try {
        const { userId } = req.query;
        const userSentChats = await ChatMessage.find({userId,senderType: 'user',}).populate('userId',{name:1,profileImage:1}).populate('doctorId',{doctorName:1,profileImage:1}); 
    
        response(req, res, activity, 'Level-2', 'Chat', true, 200, userSentChats, clientError.success.fetchedSuccessfully);
      } catch (err:any) {
      response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
      }

};

/**
 * @author Santhosh Khan K
 * @date   23-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get messages
 */

export let getDoctorChats = async (req, res, next) => {
  try{
    const { doctorId } = req.query;
    const doctorSentDetails = await ChatMessage.find({doctorId,senderType: 'doctor',}).populate('userId',{name:1,profileImage:1}).populate('doctorId',{doctorName:1,profileImage:1});;
    response(req, res, activity, 'Level-2', 'Chat', true, 200, doctorSentDetails, clientError.success.fetchedSuccessfully);
  }
  catch(err:any){
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }

}

/**
 * @author Santhosh Khan K
 * @date   23-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get all messages
 */
export let getAllChats = async (req, res, next) => {
  try{
    const chatDetails = await ChatMessage.find({isDeleted: false}).populate('userId',{name:1,profileImage:1}).populate('doctorId',{doctorName:1,profileImage:1});
    response(req, res, activity, 'Level-2', 'Chat', true, 200, chatDetails, clientError.success.fetchedSuccessfully);
  }
  catch(err:any){
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }
}





// export const doctorSendMessages = async (req, res, next) => {
//   try {
//     const chatDetails: chatMessageDocument = req.body;
//     if(!chatDetails.userId || !chatDetails.doctorId){
//       response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'userId and doctorId are required');
//     }
//   const currentTime = DateTime.utc().setZone('Asia/Kolkata');
//   chatDetails.sentOn = currentTime.toISO();

//     let senderType = 'doctor';
//     const newMessage = await ChatMessage.create({
//       userId: chatDetails.userId,
//       doctorId: chatDetails.doctorId,
//       message: chatDetails.message,
//       senderType: senderType,
      
//     });


//     const io = req.app.get('socketio');
//     if (io) {
//       io.emit('userStatus', { userId: chatDetails.userId, status: 'online' });
//       io.emit('userStatus', { doctorId: chatDetails.doctorId, status: 'online' });
//     }
//       await newMessage.save();

//       const sentOnTime = new Date(chatDetails.sentOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//       response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, {sentOnTime});
//   } catch (err:any) {
//     response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
//   }
// };



// const userSendMessages = async (req, res, next) => {
//   try {
//     const chatDetails = req.body;

//     if (!chatDetails.userId || !chatDetails.doctorId) {
//       response(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both userId and doctorId are required');
//     }

//     if (chatDetails.userId === chatDetails.doctorId) {
//       response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, 'Cannot send message to yourself');
//     }

//     const currentTime = DateTime.now().setZone('Asia/Kolkata');
//     chatDetails.sentOn = currentTime.toFormat('hh:mm a');

//     const senderType = 'user';
//     const newMessage = await ChatMessage.create({
//       userId: chatDetails.userId,
//       doctorId: chatDetails.doctorId,
//       message: chatDetails.message,
//       senderType: senderType,
//       sentOn: chatDetails.sentOn,
//       seen: false, // Default value for new messages
//     });

//     const io = req.app.get('socketio');
//     if (io) {
//       io.emit('newMessage', { userId: chatDetails.userId, doctorId: chatDetails.doctorId, message: newMessage });
//       io.emit('userStatus', { userId: chatDetails.userId, status: 'online' });
//       io.emit('userStatus', { doctorId: chatDetails.doctorId, status: 'online' });
//     }

//     await newMessage.save();
//     const sentOnTime = currentTime.toFormat('hh:mm a');
//     response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, 'Fetched successfully', { sentOnTime });
//   } catch (err) {
//     response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, 'Internal server error', err.message);
//   }
// };

export const markMessageAsSeen = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    const message = await ChatMessage.findById(messageId);

    if (!message) {
      response(req, res, activity, 'Level-3', 'Chat', false, 404, {}, 'Message not found');
    }

    message.isSeen = true;
    await message.save();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('messageSeen', { userId: message.userId, doctorId: message.doctorId, messageId: message._id });
    }

    response(req, res, activity, 'Level-2', 'Chat', true, 200, {}, 'Updated successfully', {});
  } catch (err) {
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, 'Internal server error', err.message);
  }
};

// module.exports = {
//   userSendMessages,
//   markMessageAsSeen,
// };
// 3. Router (routes/chatRoutes.js):

// javascript
// Copy code
// // routes/chatRoutes.js
// const express = require('express');
// const router = express.Router();
// const chatController = require('../controllers/chatController');

// // Routes
// router.post('/send', chatController.userSendMessages);
// router.put('/markSeen/:messageId', chatController.markMessageAsSeen);

// module.exports = router;




// Import necessary libraries
// import { DateTime } from 'luxon';

// export const userSendMessages = async (req, res, next) => {
//   try {
//     const chatDetails = req.body;
//     // ... (your existing validation code)

//     const currentTime = DateTime.now().setZone('Asia/Kolkata');
//     chatDetails.sentOn = currentTime.toFormat('hh:mm a');

//     const senderType = 'user';
//     const newMessage = await ChatMessage.create({
//       userId: chatDetails.userId,
//       doctorId: chatDetails.doctorId,
//       message: chatDetails.message,
//       senderType: senderType,
//       sentOn: chatDetails.sentOn,
//       // Add a field to track whether the message has been seen
//       seen: false,
//     });

//     const io = req.app.get('socketio');
//     if (io) {
//       // Emit event for a new message
//       io.emit('newMessage', { userId: chatDetails.userId, doctorId: chatDetails.doctorId, message: newMessage });

//       io.emit('userStatus', { userId: chatDetails.userId, status: 'online' });
//       io.emit('userStatus', { doctorId: chatDetails.doctorId, status: 'online' });
//     }

//     await newMessage.save();
//     const sentOnTime = currentTime.toFormat('hh:mm a')
//     response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, { sentOnTime });
//   } catch (err: any) {
//     response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
//   }
// };

// // Add a new route/handler to mark a message as seen
// export const markMessageAsSeen = async (req, res, next) => {
//   try {
//     const messageId = req.params.messageId;
//     const message = await ChatMessage.findById(messageId);

//     if (!message) {
//       response(req, res, activity, 'Level-3', 'Chat', false, 404, {}, 'Message not found');
//       return;
//     }

//     message.seen = true;
//     await message.save();

//     const io = req.app.get('socketio');
//     if (io) {
//       // Emit event for a message being seen
//       io.emit('messageSeen', { userId: message.userId, doctorId: message.doctorId, messageId: message._id });
//     }

//     response(req, res, activity, 'Level-2', 'Chat', true, 200, {}, clientError.success.updatedSuccessfully, {});
//   } catch (err: any) {
//     response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
//   }
// };
// In the code above, I added a new field seen to the ChatMessage model to track whether the message has been seen. Additionally, I added two new events, newMessage and messageSeen, that can be emitted to notify clients about new messages and when a user has seen a message, respectively.

// On the client side, you need to listen for these events and update the UI accordingly. Here's an example in JavaScript (assuming you're using socket.io on the client as well):

// javascript
// Copy code
// // Assuming you have a socket instance
// const socket = io();

// // Listen for new messages
// socket.on('newMessage', (data) => {
//   // Update your UI to display the new message
//   console.log('New Message:', data.message);
// });

// // Listen for message seen events
// socket.on('messageSeen', (data) => {
//   // Update your UI to mark the message as seen
//   console.log('Message Seen:', data.messageId);
// });

// // Call this function when a user sees a message
// function markMessageAsSeen(messageId) {
//   // Emit an event to notify the server that the message has been seen
//   socket.emit('markMessageAsSeen', { messageId });
// }






// const MessageComponent = ({ messageId }) => {
//   const [isSeen, setIsSeen] = useState(false);

//   const markAsSeen = async () => {
//     try {
//       await axios.put(`/api/markMessageAsSeen/${messageId}`);
//       setIsSeen(true);
//     } catch (error) {
//       console.error('Error marking message as seen:', error.message);
//       // Handle error as needed
//     }
//   };

//   return (
//     <div>
//       <p>{/* Display your message here */}</p>
//       {!isSeen && (
//         <button onClick={markAsSeen}>
//           Mark as Seen
//         </button>
//       )}
//     </div>
//   );
// };