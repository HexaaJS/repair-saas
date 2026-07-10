import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import repairService from '../services/repairService';
import './Repairs.css';
import RepairForm from '../components/RepairForm';

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

const statusFilters = [
  { value: '', label: 'Tous' },
  { value: 'reception', label: 'Réception' },
  { value: 'diagnostic', label: 'Diagnostic' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'en_attente_piece', label: 'Attente pièce' },
  { value: 'termine', label: 'Terminé' },
  { value: 'restitue', label: 'Restitué' },
];

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (status) params.status = status;

      const res = await repairService.getAll(params);
      setRepairs(res.data.data.repairs);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, [page, status]);

  const handleFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="repairs-page">
      <div className="repairs-header">
        <div>
          <h1>Réparations</h1>
          <p className="repairs-count">{total} réparation{total > 1 ? 's' : ''}</p>
        </div>
        <button className="btn-new-repair" onClick={() => setShowForm(true)}>
          + Nouvelle réparation
        </button>
      </div>

      <div className="repairs-filters">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            className={`filter-btn ${status === f.value ? 'filter-active' : ''}`}
            onClick={() => handleFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="repairs-loading">Chargement...</p>
      ) : repairs.length === 0 ? (
        <p className="repairs-empty">Aucune réparation trouvée</p>
      ) : (
        <div className="repairs-table">
          <div className="repairs-table-header">
            <span>Référence</span>
            <span>Client</span>
            <span>Appareil</span>
            <span>Statut</span>
            <span>Date</span>
          </div>

          {repairs.map((repair) => (
            <Link to={`/repairs/${repair._id}`} key={repair._id} className="repairs-table-row">
              <span className="cell-ref">{repair.reference}</span>
              <span className="cell-client">
                {repair.client?.firstName} {repair.client?.lastName}
              </span>
              <span className="cell-device">
                {repair.device?.brand} {repair.device?.model}
              </span>
              <span>
                <span className={`status-badge status-${repair.status}`}>
                  {statusLabels[repair.status]}
                </span>
              </span>
              <span className="cell-date">
                {new Date(repair.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="repairs-pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Précédent
          </button>
          <span>{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Suivant
          </button>
        </div>
      )}

      {showForm && (
        <RepairForm
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            fetchRepairs();
          }}
        />
      )}
    </div>
  );
};

export default Repairs;