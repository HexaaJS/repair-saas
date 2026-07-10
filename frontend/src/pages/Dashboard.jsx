import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import repairService from '../services/repairService';
import './Dashboard.css';

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

const Dashboard = () => {
  const { user } = useAuth();
  const [repairs, setRepairs] = useState([]);
  const [stats, setStats] = useState({
    enCours: 0,
    terminees: 0,
    total: 0,
    ca: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await repairService.getAll({ limit: 5 });
        const allRepairs = res.data.data.repairs;

        setRepairs(allRepairs);

        setStats({
          enCours: allRepairs.filter((r) =>
            ['reception', 'diagnostic', 'en_cours', 'en_attente_piece'].includes(r.status)
          ).length,
          terminees: allRepairs.filter((r) => r.status === 'termine' || r.status === 'restitue').length,
          total: res.data.data.total,
          ca: allRepairs
            .filter((r) => r.isPaid)
            .reduce((sum, r) => sum + r.finalPrice, 0),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="dashboard-loading">Chargement...</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-welcome">Bienvenue, {user?.firstName}</p>
        </div>
        <Link to="/repairs" className="btn-new-repair">
          + Nouvelle réparation
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">En cours</p>
          <p className="stat-value">{stats.enCours}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Terminées</p>
          <p className="stat-value">{stats.terminees}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total réparations</p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">CA encaissé</p>
          <p className="stat-value">{stats.ca.toLocaleString('fr-FR')} €</p>
        </div>
      </div>

      <div className="recent-repairs">
        <h2>Dernières réparations</h2>
        {repairs.length === 0 ? (
          <p className="no-data">Aucune réparation pour le moment</p>
        ) : (
          <div className="repairs-list">
            {repairs.map((repair) => (
              <Link to={`/repairs/${repair._id}`} key={repair._id} className="repair-row">
                <div>
                  <p className="repair-ref">{repair.reference}</p>
                  <p className="repair-device">
                    {repair.device?.brand} {repair.device?.model} — {repair.problemDescription}
                  </p>
                </div>
                <span className={`status-badge status-${repair.status}`}>
                  {statusLabels[repair.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;