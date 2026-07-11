const getTrackingUrl = (token) => {
  const { client } = require('../config/env');
  return `${client.url}/suivi/${token}`;
};

const templates = {
  reception: (repair, shop) =>
    `${shop.name} : votre ${repair.device.brand} ${repair.device.model} a bien été pris en charge. ` +
    `Ref: ${repair.reference}. ` +
    `Suivez votre réparation : ${getTrackingUrl(repair.trackingToken)}`,

  devis: (repair, shop) =>
    `${shop.name} : un devis de ${repair.estimatedPrice}€ a été établi pour votre ${repair.device.brand} ${repair.device.model}. ` +
    `Contactez-nous pour valider : ${shop.phone || 'voir boutique'}.`,

  en_attente_piece: (repair, shop) =>
    `${shop.name} : une pièce a été commandée pour votre ${repair.device.brand} ${repair.device.model}. ` +
    `Nous vous informerons dès réception. Ref: ${repair.reference}.`,

  termine: (repair, shop) =>
    `${shop.name} : votre ${repair.device.brand} ${repair.device.model} est réparé ! ` +
    `Vous pouvez venir le récupérer. Ref: ${repair.reference}.`,

  restitue: (repair, shop) =>
    `${shop.name} : merci de votre confiance ! ` +
    `Si vous êtes satisfait, un petit avis Google nous aiderait beaucoup `,
};

const getSMSTemplate = (status, repair, shop) => {
  const template = templates[status];
  if (!template) return null;
  return template(repair, shop);
};

module.exports = { getSMSTemplate };