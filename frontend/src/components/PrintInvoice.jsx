import { useRef } from 'react';
import './PrintInvoice.css';

const paymentLabels = {
  cb: 'Carte bancaire',
  especes: 'Espèces',
  virement: 'Virement',
  cheque: 'Chèque',
  autre: 'Autre',
};

const PrintInvoice = ({ invoice, onClose }) => {
  const invoiceRef = useRef(null);

  const handlePrint = () => {
    const content = invoiceRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Facture ${invoice.reference}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 20mm; font-size: 12px; color: #1a1a1a; }
            .inv { max-width: 700px; margin: 0 auto; }
            .inv-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .inv-shop-name { font-size: 20px; font-weight: bold; margin-bottom: 4px; }
            .inv-shop-detail { font-size: 11px; color: #666; line-height: 1.5; }
            .inv-ref-block { text-align: right; }
            .inv-ref { font-size: 22px; font-weight: bold; color: #6366f1; }
            .inv-ref-date { font-size: 11px; color: #666; margin-top: 4px; }
            .inv-client { background: #f8f8f8; padding: 14px; border-radius: 6px; margin-bottom: 24px; }
            .inv-client-title { font-size: 10px; text-transform: uppercase; color: #888; margin-bottom: 4px; }
            .inv-client-name { font-size: 14px; font-weight: bold; }
            .inv-client-detail { font-size: 11px; color: #666; margin-top: 2px; }
            .inv-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .inv-table th { background: #f8f8f8; text-align: left; padding: 8px 10px; font-size: 10px; text-transform: uppercase; color: #888; border-bottom: 1px solid #ddd; }
            .inv-table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
            .inv-table .text-right { text-align: right; }
            .inv-totals { display: flex; justify-content: flex-end; margin-bottom: 24px; }
            .inv-totals-box { width: 220px; }
            .inv-totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #666; }
            .inv-totals-ttc { border-top: 2px solid #1a1a1a; padding-top: 6px; margin-top: 4px; font-size: 16px; font-weight: bold; color: #1a1a1a; }
            .inv-payment { background: #f0fdf4; padding: 10px 14px; border-radius: 6px; font-size: 12px; color: #166534; margin-bottom: 20px; }
            .inv-unpaid { background: #fef3c7; color: #92400e; }
            .inv-notes { font-size: 11px; color: #888; margin-bottom: 20px; }
            .inv-footer { border-top: 1px solid #eee; padding-top: 12px; font-size: 9px; color: #aaa; text-align: center; }
            @media print { body { padding: 10mm; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="print-invoice-modal" onClick={(e) => e.stopPropagation()}>
        <div className="print-modal-header">
          <h2>Facture {invoice.reference}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="print-invoice-preview" ref={invoiceRef}>
          <div className="inv">
            {/* Header */}
            <div className="inv-header">
              <div>
                <div className="inv-shop-name">{invoice.shop?.name}</div>
                <div className="inv-shop-detail">
                  {invoice.shop?.address?.street && <>{invoice.shop.address.street}<br /></>}
                  {invoice.shop?.address?.zipCode} {invoice.shop?.address?.city}<br />
                  {invoice.shop?.phone && <>Tél: {invoice.shop.phone}<br /></>}
                  {invoice.shop?.siret && <>SIRET: {invoice.shop.siret}</>}
                </div>
              </div>
              <div className="inv-ref-block">
                <div className="inv-ref">{invoice.reference}</div>
                <div className="inv-ref-date">
                  Date: {new Date(invoice.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div className="inv-ref-date">
                  Réparation: {invoice.repair?.reference}
                </div>
              </div>
            </div>

            {/* Client */}
            <div className="inv-client">
              <div className="inv-client-title">Facturé à</div>
              <div className="inv-client-name">
                {invoice.client?.firstName} {invoice.client?.lastName}
              </div>
              {invoice.client?.phone && (
                <div className="inv-client-detail">Tél: {invoice.client.phone}</div>
              )}
              {invoice.client?.email && (
                <div className="inv-client-detail">{invoice.client.email}</div>
              )}
            </div>

            {/* Tableau */}
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-right">Qté</th>
                  <th className="text-right">Prix HT</th>
                  <th className="text-right">TVA</th>
                  <th className="text-right">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{item.unitPrice.toFixed(2)} €</td>
                    <td className="text-right">{item.tva}%</td>
                    <td className="text-right">{(item.quantity * item.unitPrice).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totaux */}
            <div className="inv-totals">
              <div className="inv-totals-box">
                <div className="inv-totals-row">
                  <span>Total HT</span>
                  <span>{invoice.totalHT.toFixed(2)} €</span>
                </div>
                <div className="inv-totals-row">
                  <span>TVA</span>
                  <span>{invoice.totalTVA.toFixed(2)} €</span>
                </div>
                <div className="inv-totals-row inv-totals-ttc">
                  <span>Total TTC</span>
                  <span>{invoice.totalTTC.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div className={`inv-payment ${!invoice.isPaid ? 'inv-unpaid' : ''}`}>
              {invoice.isPaid
                ? `✓ Payé par ${paymentLabels[invoice.paymentMethod] || invoice.paymentMethod} le ${new Date(invoice.paidAt).toLocaleDateString('fr-FR')}`
                : '⏳ En attente de paiement'
              }
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="inv-notes">{invoice.notes}</div>
            )}

            {/* Footer */}
            <div className="inv-footer">
              {invoice.shop?.name} — {invoice.shop?.siret && `SIRET: ${invoice.shop.siret} — `}
              Garantie 3 mois sur la réparation — Merci de votre confiance
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

export default PrintInvoice;