// notification-utils.ts

import axios from 'axios';

export const notifyUser = async (userId: string, message: string, senderId: string) => {
  // Replace the following line with the actual API endpoint and key for your notification service
  const notificationApiEndpoint = 'https://your-notification-service-api.com/send';

  try {
    const notificationPayload = {
      userId,
      message,
      senderId,
    };

    // Send a POST request to the notification service
    const response = await axios.post(notificationApiEndpoint, notificationPayload);

    // Check the response and handle accordingly
    if (response.status === 200 && response.data.success) {
      console.log(`Notification sent successfully to user ${userId} from sender ${senderId}`);
    } else {
      console.error(`Failed to send notification: ${response.data.message}`);
    }
  } catch (error) {
    console.error('Error sending notification:', error.message);
    throw error; // You can handle the error according to your needs
  }
};
