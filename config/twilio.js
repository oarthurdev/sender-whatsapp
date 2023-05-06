import twilio from "twilio";

/**
 * Creates a Twilio client using the account SID and auth token from environment variables.
 * @returns {Twilio} The Twilio client instance.
 * @throws {Error} If the Twilio credentials are missing or invalid.
 */
export function createTwilioClient() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error("Missing Twilio credentials");
  }
  return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}