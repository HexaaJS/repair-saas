import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import repairService from '../services/repairService';
import './RepairDetail.css';
import PatternDisplay from '../components/PatternDisplay';
import PrintTicket from '../components/PrintTicket';
import InvoiceForm from '../components/InvoiceForm';
import PrintInvoice from '../components/PrintInvoice';
import invoiceService from '../services/invoiceService';

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

const statusFlow = ['reception', 'diagnostic', 'devis', 'en_attente_piece', 'en_cours', 'termine', 'restitue'];

const RepairDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
const [showInvoice, setShowInvoice] = useState(false);
const [invoice, setInvoice] = useState(null);

  const fetchRepair = async () => {
    try {
      const res = await repairService.getOne(id);
      setRepair(res.data.data.repair);

       const invRes = await invoiceService.getAll({ repair: id });
    if (invRes.data.data.invoices.length > 0) {
      const fullInv = await invoiceService.getOne(invRes.data.data.invoices[0]._id);
      setInvoice(fullInv.data.data.invoice);
    }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepair();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await repairService.updateStatus(id, newStatus);
      await fetchRepair();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="detail-loading">Chargement...</p>;
  if (!repair) return <p className="detail-loading">Réparation introuvable</p>;

  const currentIndex = statusFlow.indexOf(repair.status);

  return (
    <div className="repair-detail">
      <div className="detail-top">
        <button className="btn-back-page" onClick={() => navigate('/repairs')}>
          ← Retour
        </button>
        <div className="detail-title">
          <h1>{repair.reference}</h1>
          <span className={`status-badge status-${repair.status}`}>
            {statusLabels[repair.status]}
          </span>
        </div>
        <p className="detail-date">
          Créée le {new Date(repair.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Timeline statut */}
      <div className="status-timeline">
        {statusFlow.map((status, index) => (
          <div
            key={status}
            className={`timeline-step ${index <= currentIndex ? 'timeline-done' : ''} ${
              index === currentIndex ? 'timeline-current' : ''
            }`}
          >
            <div className="timeline-dot" />
            <span className="timeline-label">{statusLabels[status]}</span>
          </div>
        ))}
      </div>

      <div className="detail-grid">
        {/* Client */}
        <div className="detail-card">
          <h3>Client</h3>
          <div className="detail-field">
            <span className="field-label">Nom</span>
            <span className="field-value">
              {repair.client?.firstName} {repair.client?.lastName}
            </span>
          </div>
          <div className="detail-field">
            <span className="field-label">Téléphone</span>
            <span className="field-value">{repair.client?.phone}</span>
          </div>
          {repair.client?.email && (
            <div className="detail-field">
              <span className="field-label">Email</span>
              <span className="field-value">{repair.client?.email}</span>
            </div>
          )}
        </div>

        {/* Appareil */}
        <div className="detail-card">
          <h3>Appareil</h3>
          <div className="detail-field">
            <span className="field-label">Type</span>
            <span className="field-value">{repair.device?.type}</span>
          </div>
          <div className="detail-field">
            <span className="field-label">Marque / Modèle</span>
            <span className="field-value">
              {repair.device?.brand} {repair.device?.model}
            </span>
          </div>
          {repair.device?.serial && (
            <div className="detail-field">
              <span className="field-label">N° de série</span>
              <span className="field-value">{repair.device?.serial}</span>
            </div>
          )}
       {repair.device?.password && (
            <div className="detail-field">
              <span className="field-label">Déverrouillage</span>
              {repair.device.password.includes('-') ? (
                <PatternDisplay pattern={repair.device.password} />
              ) : (
                <span className="field-value">{repair.device.password}</span>
              )}
            </div>
          )}
        </div>

        {/* Réparation */}
        <div className="detail-card">
          <h3>Réparation</h3>
          <div className="detail-field">
            <span className="field-label">Problème</span>
            <span className="field-value">{repair.problemDescription}</span>
          </div>
          {repair.diagnostic && (
            <div className="detail-field">
              <span className="field-label">Diagnostic</span>
              <span className="field-value">{repair.diagnostic}</span>
            </div>
          )}
          {repair.notes && (
            <div className="detail-field">
              <span className="field-label">Notes internes</span>
              <span className="field-value">{repair.notes}</span>
            </div>
          )}
        </div>

        {/* Prix */}
        <div className="detail-card">
          <h3>Facturation</h3>
          <div className="detail-field">
            <span className="field-label">Prix estimé</span>
            <span className="field-value">{repair.estimatedPrice} €</span>
          </div>
          <div className="detail-field">
            <span className="field-label">Prix final</span>
            <span className="field-value">{repair.finalPrice} €</span>
          </div>
          <div className="detail-field">
            <span className="field-label">Paiement</span>
            <span className={`field-value ${repair.isPaid ? 'paid' : 'unpaid'}`}>
              {repair.isPaid ? 'Payé' : 'Non payé'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {repair.status !== 'restitue' && repair.status !== 'annule' && (
        <div className="detail-actions">
          {currentIndex < statusFlow.length - 1 && (
            <button
              className="btn-next-status"
              onClick={() => handleStatusChange(statusFlow[currentIndex + 1])}
              disabled={updating}
            >
              {updating ? 'Mise à jour...' : `Passer en "${statusLabels[statusFlow[currentIndex + 1]]}"`}
            </button>
          )}
          <button className="btn-print" onClick={() => setShowTicket(true)}>
            🖨️ Imprimer le ticket
          </button>

          {!invoice ? (
            <button className="btn-invoice" onClick={() => setShowInvoiceForm(true)}>
              📄 Créer une facture
            </button>
          ) : (
            <button className="btn-invoice" onClick={() => setShowInvoice(true)}>
              📄 Voir la facture {invoice.reference}
            </button>
          )}

          <button
            className="btn-cancel-repair"
            onClick={() => handleStatusChange('annule')}
            disabled={updating}
          >
            Annuler la réparation
          </button>
        </div>
      )}

      {/* Lien de suivi */}
      {repair.trackingToken && (
        <div className="tracking-link">
          <span className="field-label">Lien de suivi client</span>
          <code>{window.location.origin}/suivi/{repair.trackingToken}</code>
        </div>
      )}

      {showTicket && (
        <PrintTicket repair={repair} onClose={() => setShowTicket(false)} />
      )}

      {showInvoiceForm && (
        <InvoiceForm
          repair={repair}
          onClose={() => setShowInvoiceForm(false)}
          onCreated={() => {
            setShowInvoiceForm(false);
            fetchRepair();
          }}
        />
      )}

      {showInvoice && invoice && (
        <PrintInvoice invoice={invoice} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default RepairDetail;