import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import repairService from '../services/repairService';
import './Tracking.css';

const statusLabels = {
  reception: 'Réception',
  diagnostic: 'Diagnostic',
  devis: 'Devis',
  en_attente_piece: 'En attente de pièce',
  en_cours: 'Réparation en cours',
  termine: 'Terminé',
  restitue: 'Restitué',
  annule: 'Annulé',
};

const statusMessages = {
  reception: 'Votre appareil a été pris en charge.',
  diagnostic: 'Notre technicien examine votre appareil.',
  devis: 'Un devis a été établi, nous attendons votre validation.',
  en_attente_piece: 'Une pièce a été commandée, elle arrivera prochainement.',
  en_cours: 'La réparation est en cours, bientôt prêt !',
  termine: 'Votre appareil est réparé ! Vous pouvez venir le récupérer.',
  restitue: 'Votre appareil vous a été remis. Merci de votre confiance !',
  annule: 'La réparation a été annulée.',
};

const statusFlow = ['reception', 'diagnostic', 'devis', 'en_attente_piece', 'en_cours', 'termine', 'restitue'];

const Tracking = () => {
  const { token } = useParams();
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const res = await repairService.track(token);
        setRepair(res.data.data.repair);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [token]);

  if (loading) {
    return (
      <div className="tracking-page">
        <div className="tracking-card">
          <p className="tracking-loading">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !repair) {
    return (
      <div className="tracking-page">
        <div className="tracking-card">
          <div className="tracking-error">
            <h1>Réparation introuvable</h1>
            <p>Le lien est peut-être invalide ou expiré. Contactez votre boutique pour plus d'informations.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = statusFlow.indexOf(repair.status);
  const isFinished = repair.status === 'termine' || repair.status === 'restitue';
  const isCancelled = repair.status === 'annule';

  return (
    <div className="tracking-page">
      <div className="tracking-card">
        <div className="tracking-header">
          <div className="tracking-logo">
            <span className="tracking-logo-icon">R</span>
            <span className="tracking-logo-text">{repair.shop?.name || 'RepairSaaS'}</span>
          </div>
          <span className="tracking-ref">{repair.reference}</span>
        </div>

        <div className={`tracking-status ${isCancelled ? 'tracking-cancelled' : isFinished ? 'tracking-finished' : ''}`}>
          <h1>{statusLabels[repair.status]}</h1>
          <p>{statusMessages[repair.status]}</p>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div className="tracking-timeline">
            {statusFlow.map((status, index) => (
              <div
                key={status}
                className={`tracking-step ${index <= currentIndex ? 'tracking-step-done' : ''} ${
                  index === currentIndex ? 'tracking-step-current' : ''
                }`}
              >
                <div className="tracking-dot">
                  {index < currentIndex && '✓'}
                </div>
                <span className="tracking-step-label">{statusLabels[status]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Infos */}
        <div className="tracking-infos">
          <div className="tracking-info-row">
            <span className="tracking-info-label">Appareil</span>
            <span className="tracking-info-value">
              {repair.device?.brand} {repair.device?.model}
            </span>
          </div>
          <div className="tracking-info-row">
            <span className="tracking-info-label">Problème</span>
            <span className="tracking-info-value">{repair.problemDescription}</span>
          </div>
          {repair.estimatedPrice > 0 && (
            <div className="tracking-info-row">
              <span className="tracking-info-label">Prix estimé</span>
              <span className="tracking-info-value">{repair.estimatedPrice} €</span>
            </div>
          )}
          {repair.estimatedEndDate && (
            <div className="tracking-info-row">
              <span className="tracking-info-label">Date estimée</span>
              <span className="tracking-info-value">
                {new Date(repair.estimatedEndDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          <div className="tracking-info-row">
            <span className="tracking-info-label">Déposé le</span>
            <span className="tracking-info-value">
              {new Date(repair.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Contact boutique */}
        {repair.shop?.phone && (
          <div className="tracking-contact">
            <p>Une question ?</p>
            <a href={`tel:${repair.shop.phone}`} className="tracking-call">
              📞 Appeler la boutique
            </a>
          </div>
        )}

        <p className="tracking-footer">Propulsé par RepairSaaS</p>
      </div>
    </div>
  );
};

export default Tracking;