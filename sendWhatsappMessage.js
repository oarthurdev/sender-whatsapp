import { config } from 'dotenv';
import { createTwilioClient } from './config/twilio.js';
import chalk from 'chalk';

config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFromNumber = process.env.TWILIO_FROM_NUMBER;

export function sendWhatsappMessage(to, message, mediaUrl = null) {
    const twilioClient = createTwilioClient();
    
    // Create a new Promise that resolves after a 3-second delay
    const loadingPromise = new Promise((resolve) => {
      console.log(chalk.blue.bold('Enviando mensagem...'));
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  
    // Send the message after the loadingPromise has resolved
    return loadingPromise.then(() => {
      if (mediaUrl) {
        return twilioClient.messages.create({
          body: message,
          from: `whatsapp:${twilioFromNumber}`,
          to: `whatsapp:${to}`,
          mediaUrl: mediaUrl,
        });
      } else {
        return twilioClient.messages.create({
          body: message,
          from: `whatsapp:${twilioFromNumber}`,
          to: `whatsapp:${to}`,
        });
      }
    });

    
}