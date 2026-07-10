import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clientService from '../services/clientService';
import repairService from '../services/repairService';
import './Clients.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientRepairs, setClientRepairs] = useState([]);
  const [loadingRepairs, setLoadingRepairs] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await clientService.getAll();
      setClients(res.data.data.clients);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearch(value);
    setSelectedClient(null);

    if (value.length < 2) {
      fetchClients();
      return;
    }

    try {
      const res = await clientService.search(value);
      setClients(res.data.data.clients);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectClient = async (client) => {
    setSelectedClient(client);
    setLoadingRepairs(true);

    try {
      const res = await repairService.getAll({ client: client._id });
      setClientRepairs(res.data.data.repairs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRepairs(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

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

  return (
    <div className="clients-page">
      <div className="clients-header">
        <div>
          <h1>Clients</h1>
          <p className="clients-count">{clients.length} client{clients.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="clients-search">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher par nom, téléphone ou email..."
        />
      </div>

      <div className="clients-layout">
        {/* Liste */}
        <div className="clients-list">
          {loading ? (
            <p className="clients-empty">Chargement...</p>
          ) : clients.length === 0 ? (
            <p className="clients-empty">Aucun client trouvé</p>
          ) : (
            clients.map((client) => (
              <div
                key={client._id}
                className={`client-row ${selectedClient?._id === client._id ? 'client-row-active' : ''}`}
                onClick={() => handleSelectClient(client)}
              >
                <div className="client-avatar">
                  {client.firstName[0]}{client.lastName[0]}
                </div>
                <div className="client-info">
                  <p className="client-name">{client.firstName} {client.lastName}</p>
                  <p className="client-phone">{client.phone}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Détail client */}
        <div className="client-detail">
          {!selectedClient ? (
            <div className="client-detail-empty">
              <p>Sélectionnez un client pour voir ses informations</p>
            </div>
          ) : (
            <>
              <div className="client-detail-header">
                <div className="client-detail-avatar">
                  {selectedClient.firstName[0]}{selectedClient.lastName[0]}
                </div>
                <div>
                  <h2>{selectedClient.firstName} {selectedClient.lastName}</h2>
                  <p className="client-detail-since">
                    Client depuis le {new Date(selectedClient.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="client-detail-infos">
                <div className="client-detail-field">
                  <span className="field-label">Téléphone</span>
                  <span className="field-value">{selectedClient.phone}</span>
                </div>
                {selectedClient.email && (
                  <div className="client-detail-field">
                    <span className="field-label">Email</span>
                    <span className="field-value">{selectedClient.email}</span>
                  </div>
                )}
                {selectedClient.notes && (
                  <div className="client-detail-field">
                    <span className="field-label">Notes</span>
                    <span className="field-value">{selectedClient.notes}</span>
                  </div>
                )}
              </div>

              <div className="client-repairs">
                <h3>Historique des réparations</h3>
                {loadingRepairs ? (
                  <p className="clients-empty">Chargement...</p>
                ) : clientRepairs.length === 0 ? (
                  <p className="clients-empty">Aucune réparation</p>
                ) : (
                  clientRepairs.map((repair) => (
                    <Link
                      to={`/repairs/${repair._id}`}
                      key={repair._id}
                      className="client-repair-row"
                    >
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
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;