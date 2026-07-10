import { useRef } from 'react';
import './PrintTicket.css';

const statusLabels = {
  reception: 'Réception',
  diagnostic: 'Diagnostic',
  devis: 'Devis',
  en_attente_piece: 'Attente pièce',
  en_cours: 'En cours',
  termine: 'Terminé',
  restitue: 'Restitué',
  annule: 'Annulé',
};

const PrintTicket = ({ repair, onClose }) => {
  const ticketRef = useRef(null);

  const handlePrint = () => {
    const content = ticketRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Ticket ${repair.reference}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; padding: 10mm; font-size: 12px; color: #000; }
            .ticket { max-width: 80mm; margin: 0 auto; }
            .ticket-center { text-align: center; }
            .ticket-shop { font-size: 16px; font-weight: bold; margin-bottom: 2px; }
            .ticket-address { font-size: 10px; color: #555; margin-bottom: 1px; }
            .ticket-sep { border-top: 1px dashed #000; margin: 8px 0; }
            .ticket-ref { font-size: 18px; font-weight: bold; letter-spacing: 1px; }
            .ticket-date { font-size: 10px; color: #555; margin-top: 2px; }
            .ticket-section { margin: 6px 0; }
            .ticket-section-title { font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 4px; }
            .ticket-row { display: flex; justify-content: space-between; padding: 1px 0; }
            .ticket-label { color: #555; }
            .ticket-value { font-weight: bold; text-align: right; max-width: 55%; }
            .ticket-problem { margin-top: 4px; padding: 4px; background: #f5f5f5; font-size: 11px; }
            .ticket-tracking { margin-top: 6px; text-align: center; font-size: 10px; color: #555; }
            .ticket-tracking code { display: block; font-size: 11px; color: #000; margin-top: 2px; word-break: break-all; }
            .ticket-footer { margin-top: 8px; text-align: center; font-size: 9px; color: #888; }
            .ticket-signature { margin-top: 16px; }
            .ticket-signature-line { border-top: 1px solid #000; margin-top: 30px; padding-top: 4px; font-size: 10px; }
            .ticket-pattern { margin-top: 4px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const trackingUrl = `${window.location.origin}/suivi/${repair.trackingToken}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="print-modal" onClick={(e) => e.stopPropagation()}>
        <div className="print-modal-header">
          <h2>Ticket de prise en charge</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="print-preview" ref={ticketRef}>
          <div className="ticket">
            {/* En-tête boutique */}
            <div className="ticket-center">
              <div className="ticket-shop">{repair.shop?.name || 'RepairSaaS'}</div>
              {repair.shop?.address && (
                <div className="ticket-address">
                  {repair.shop.address.street}<br />
                  {repair.shop.address.zipCode} {repair.shop.address.city}
                </div>
              )}
              {repair.shop?.phone && (
                <div className="ticket-address">Tél: {repair.shop.phone}</div>
              )}
            </div>

            <div className="ticket-sep" />

            {/* Référence */}
            <div className="ticket-center">
              <div className="ticket-ref">{repair.reference}</div>
              <div className="ticket-date">
                {new Date(repair.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="ticket-sep" />

            {/* Client */}
            <div className="ticket-section">
              <div className="ticket-section-title">Client</div>
              <div className="ticket-row">
                <span className="ticket-label">Nom</span>
                <span className="ticket-value">{repair.client?.firstName} {repair.client?.lastName}</span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">Tél</span>
                <span className="ticket-value">{repair.client?.phone}</span>
              </div>
            </div>

            <div className="ticket-sep" />

            {/* Appareil */}
            <div className="ticket-section">
              <div className="ticket-section-title">Appareil</div>
              <div className="ticket-row">
                <span className="ticket-label">Type</span>
                <span className="ticket-value">{repair.device?.type}</span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">Marque</span>
                <span className="ticket-value">{repair.device?.brand} {repair.device?.model}</span>
              </div>
              {repair.device?.serial && (
                <div className="ticket-row">
                  <span className="ticket-label">N° série</span>
                  <span className="ticket-value">{repair.device.serial}</span>
                </div>
              )}
              {repair.device?.password && (
                <div className="ticket-row">
                  <span className="ticket-label">Code</span>
                  <span className="ticket-value">
                    {repair.device.password.includes('-') ? 'Schéma (voir fiche)' : repair.device.password}
                  </span>
                </div>
              )}
            </div>

            <div className="ticket-sep" />

            {/* Problème */}
            <div className="ticket-section">
              <div className="ticket-section-title">Problème déclaré</div>
              <div className="ticket-problem">{repair.problemDescription}</div>
            </div>

            <div className="ticket-sep" />

            {/* Prix */}
            {repair.estimatedPrice > 0 && (
              <>
                <div className="ticket-section">
                  <div className="ticket-row">
                    <span className="ticket-label">Prix estimé</span>
                    <span className="ticket-value">{repair.estimatedPrice} €</span>
                  </div>
                </div>
                <div className="ticket-sep" />
              </>
            )}

            {/* Suivi */}
            <div className="ticket-tracking">
              Suivez votre réparation en ligne :
              <code>{trackingUrl}</code>
            </div>

            {/* Signature */}
            <div className="ticket-signature">
              <div className="ticket-signature-line">Signature du client</div>
            </div>

            <div className="ticket-sep" />

            <div className="ticket-footer">
              Garantie 3 mois sur la réparation<br />
              Merci de votre confiance !
            </div>
          </div>
        </div>

        <div className="print-modal-footer">
          <button className="btn-back" onClick={onClose}>Fermer</button>
          <button className="btn-submit" onClick={handlePrint}>🖨️ Imprimer</button>
        </div>
      </div>
    </div>
  );
};

export default PrintTicket;