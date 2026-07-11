const { sms, isDev } = require('../config/env');

let twilioClient = null;

if (sms.provider === 'twilio' && sms.twilioSid && sms.twilioAuth) {
  const twilio = require('twilio');
  twilioClient = twilio(sms.twilioSid, sms.twilioAuth);
}

const sendSMS = async (to, message) => {
  // Mode console en dev
  if (sms.provider === 'console' || isDev) {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   📱  SMS (mode console)                     ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║   À    : ${to.padEnd(36)}║`);
    console.log(`║   Msg  : ${message.substring(0, 36).padEnd(36)}║`);
    if (message.length > 36) {
      console.log(`║         ${message.substring(36, 72).padEnd(36)}║`);
    }
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
    return { success: true, provider: 'console' };
  }

  // Mode Twilio
  if (sms.provider === 'twilio' && twilioClient) {
    try {
      const result = await twilioClient.messages.create({
        body: message,
        from: sms.twilioFrom,
        to,
      });

      return { success: true, provider: 'twilio', sid: result.sid };
    } catch (error) {
      console.error('❌ Erreur SMS Twilio:', error.message);
      return { success: false, error: error.message };
    }
  }

  console.error('❌ Aucun provider SMS configuré');
  return { success: false, error: 'Aucun provider configuré' };
};

module.exports = { sendSMS };