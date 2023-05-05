import { config } from 'dotenv';
import twilio from 'twilio';

config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export function sendWhatsappMessage(to, message, mediaUrl = null) {
  const messageOptions = {
    from: 'whatsapp:+14155238886', // Twilio sandbox number
    to: `whatsapp:${to}`, // número do destinatário
    body: message, // mensagem a ser enviada
  };

  if (mediaUrl !== null) {
    messageOptions.mediaUrl = [mediaUrl]; // adicionar a URL da mídia se estiver presente
  }

  return client.messages.create(messageOptions);
}