import { useState } from 'react';
import invoiceService from '../services/invoiceService';
import './InvoiceForm.css';

const paymentMethods = [
  { value: 'cb', label: 'Carte bancaire' },
  { value: 'especes', label: 'Espèces' },
  { value: 'virement', label: 'Virement' },
  { value: 'cheque', label: 'Chèque' },
  { value: 'autre', label: 'Autre' },
];

const InvoiceForm = ({ repair, onClose, onCreated }) => {
  const [items, setItems] = useState([
    {
      description: `Réparation ${repair.device?.brand} ${repair.device?.model} — ${repair.problemDescription}`,
      quantity: 1,
      unitPrice: repair.estimatedPrice || 0,
      tva: 20,
    },
  ]);
  const [paymentMethod, setPaymentMethod] = useState('cb');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, tva: 20 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'description' ? value : Number(value);
    setItems(updated);
  };

  // Calculs
  const totalHT = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalTVA = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * (item.tva / 100),
    0
  );
  const totalTTC = totalHT + totalTVA;

  const handleSubmit = async () => {
    setError('');

    const hasEmpty = items.some((item) => !item.description || item.unitPrice <= 0);
    if (hasEmpty) {
      setError('Chaque ligne doit avoir une description et un prix');
      return;
    }

    setLoading(true);

    try {
      await invoiceService.create({
        repairId: repair._id,
        items,
        paymentMethod,
        notes,
      });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Créer une facture</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="invoice-repair-info">
          <span>{repair.reference}</span>
          <span>{repair.client?.firstName} {repair.client?.lastName}</span>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="invoice-modal-body">
          {/* Lignes */}
          <div className="invoice-items">
            <div className="invoice-items-header">
              <span className="col-desc">Description</span>
              <span className="col-qty">Qté</span>
              <span className="col-price">Prix HT</span>
              <span className="col-tva">TVA %</span>
              <span className="col-total">Total HT</span>
              <span className="col-action" />
            </div>

            {items.map((item, index) => (
              <div key={index} className="invoice-item-row">
                <input
                  className="col-desc"
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Description..."
                />
                <input
                  className="col-qty"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  min="1"
                />
                <input
                  className="col-price"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                  min="0"
                  step="0.01"
                />
                <select
                  className="col-tva"
                  value={item.tva}
                  onChange={(e) => updateItem(index, 'tva', e.target.value)}
                >
                  <option value={20}>20%</option>
                  <option value={10}>10%</option>
                  <option value={5.5}>5.5%</option>
                  <option value={0}>0%</option>
                </select>
                <span className="col-total">
                  {(item.quantity * item.unitPrice).toFixed(2)} €
                </span>
                <button
                  className="col-action btn-remove-item"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}

            <button className="btn-add-item" onClick={addItem}>
              + Ajouter une ligne
            </button>
          </div>

          {/* Totaux */}
          <div className="invoice-totals">
            <div className="invoice-total-row">
              <span>Total HT</span>
              <span>{totalHT.toFixed(2)} €</span>
            </div>
            <div className="invoice-total-row">
              <span>TVA</span>
              <span>{totalTVA.toFixed(2)} €</span>
            </div>
            <div className="invoice-total-row invoice-total-ttc">
              <span>Total TTC</span>
              <span>{totalTTC.toFixed(2)} €</span>
            </div>
          </div>

          {/* Options */}
          <div className="invoice-options">
            <div className="form-group">
              <label>Mode de paiement</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Notes (optionnel)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Garantie, conditions..."
              />
            </div>
          </div>
        </div>

        <div className="invoice-modal-footer">
          <button className="btn-back" onClick={onClose}>Annuler</button>
          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Création...' : `Créer la facture — ${totalTTC.toFixed(2)} €`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;