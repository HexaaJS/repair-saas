import { useState } from 'react';
import repairService from '../services/repairService';
import clientService from '../services/clientService';
import { getBrands, getModels } from '../constants/devices';
import PatternLock from './PatternLock';
import './RepairForm.css';

const deviceTypes = [
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'tablette', label: 'Tablette' },
  { value: 'ordinateur', label: 'Ordinateur' },
  { value: 'console', label: 'Console' },
  { value: 'trottinette', label: 'Trottinette' },
  { value: 'autre', label: 'Autre' },
];

const RepairForm = ({ onClose, onCreated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Client
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [isNewClient, setIsNewClient] = useState(false);

  // Réparation
  const [repair, setRepair] = useState({
    device: {
      type: 'smartphone',
      brand: '',
      model: '',
      serial: '',
      lockType: 'none',
      password: '',
    },
    problemDescription: '',
    estimatedPrice: '',
  });

  // Recherche client
  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await clientService.search(value);
      setSearchResults(res.data.data.clients);
    } catch (err) {
      console.error(err);
    }
  };

  const selectClient = (client) => {
    setSelectedClient(client);
    setSearchQuery('');
    setSearchResults([]);
    setIsNewClient(false);
  };

  // Soumission
  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      let clientId = selectedClient?._id;

      if (isNewClient) {
        const res = await clientService.create(newClient);
        clientId = res.data.data.client._id;
      }

      if (!clientId) {
        setError('Veuillez sélectionner ou créer un client');
        setLoading(false);
        return;
      }

      await repairService.create({
        client: clientId,
        device: repair.device,
        problemDescription: repair.problemDescription,
        estimatedPrice: repair.estimatedPrice ? Number(repair.estimatedPrice) : 0,
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nouvelle réparation</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="modal-steps">
          <span className={`modal-step ${step >= 1 ? 'step-active' : ''}`}>1. Client</span>
          <span className={`modal-step ${step >= 2 ? 'step-active' : ''}`}>2. Appareil</span>
        </div>

        {/* Étape 1 : Client */}
        {step === 1 && (
          <div className="modal-body">
            {!selectedClient && !isNewClient && (
              <>
                <div className="form-group">
                  <label>Rechercher un client</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Nom, téléphone ou email..."
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map((client) => (
                      <div
                        key={client._id}
                        className="search-result-item"
                        onClick={() => selectClient(client)}
                      >
                        <p className="result-name">{client.firstName} {client.lastName}</p>
                        <p className="result-phone">{client.phone}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="btn-new-client"
                  onClick={() => setIsNewClient(true)}
                >
                  + Nouveau client
                </button>
              </>
            )}

            {selectedClient && (
              <div className="selected-client">
                <div>
                  <p className="result-name">{selectedClient.firstName} {selectedClient.lastName}</p>
                  <p className="result-phone">{selectedClient.phone}</p>
                </div>
                <button className="btn-change" onClick={() => setSelectedClient(null)}>
                  Changer
                </button>
              </div>
            )}

            {isNewClient && (
              <div className="new-client-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input
                      type="text"
                      value={newClient.firstName}
                      onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      value={newClient.lastName}
                      onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email (optionnel)</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </div>
                <button className="btn-change" onClick={() => setIsNewClient(false)}>
                  Annuler
                </button>
              </div>
            )}

            <div className="modal-footer">
              <button
                className="btn-next"
                disabled={!selectedClient && !isNewClient}
                onClick={() => setStep(2)}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Étape 2 : Appareil */}
        {step === 2 && (
          <div className="modal-body">
            <div className="form-group">
              <label>Type d'appareil</label>
              <select
                value={repair.device.type}
                onChange={(e) =>
                  setRepair({
                    ...repair,
                    device: { ...repair.device, type: e.target.value, brand: '', model: '' },
                  })
                }
              >
                {deviceTypes.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Marque</label>
                <input
                  type="text"
                  value={repair.device.brand}
                  onChange={(e) =>
                    setRepair({
                      ...repair,
                      device: { ...repair.device, brand: e.target.value, model: '' },
                    })
                  }
                  placeholder="Commencez à taper..."
                  list="brand-list"
                />
                <datalist id="brand-list">
                  {getBrands(repair.device.type).map((brand) => (
                    <option key={brand} value={brand} />
                  ))}
                </datalist>
              </div>
              <div className="form-group">
                <label>Modèle</label>
                <input
                  type="text"
                  value={repair.device.model}
                  onChange={(e) =>
                    setRepair({
                      ...repair,
                      device: { ...repair.device, model: e.target.value },
                    })
                  }
                  placeholder={repair.device.brand ? 'Choisir un modèle...' : 'Sélectionnez une marque'}
                  list="model-list"
                />
                <datalist id="model-list">
                  {getModels(repair.device.type, repair.device.brand).map((model) => (
                    <option key={model} value={model} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>N° de série (optionnel)</label>
                <input
                  type="text"
                  value={repair.device.serial}
                  onChange={(e) =>
                    setRepair({ ...repair, device: { ...repair.device, serial: e.target.value } })
                  }
                />
              </div>
              <div className="form-group">
                <label>Déverrouillage</label>
                <select
                  value={repair.device.lockType}
                  onChange={(e) =>
                    setRepair({
                      ...repair,
                      device: { ...repair.device, lockType: e.target.value, password: '' },
                    })
                  }
                >
                  <option value="none">Aucun</option>
                  <option value="code">Code PIN</option>
                  <option value="pattern">Schéma</option>
                </select>
              </div>
            </div>

            {repair.device.lockType === 'code' && (
              <div className="form-group">
                <label>Code PIN</label>
                <input
                  type="text"
                  value={repair.device.password}
                  onChange={(e) =>
                    setRepair({ ...repair, device: { ...repair.device, password: e.target.value } })
                  }
                  placeholder="1234"
                />
              </div>
            )}

            {repair.device.lockType === 'pattern' && (
              <div className="form-group">
                <label>Schéma</label>
                <PatternLock
                  onPattern={(value) =>
                    setRepair({ ...repair, device: { ...repair.device, password: value } })
                  }
                />
              </div>
            )}

            <div className="form-group">
              <label>Description du problème</label>
              <textarea
                value={repair.problemDescription}
                onChange={(e) => setRepair({ ...repair, problemDescription: e.target.value })}
                placeholder="Écran cassé, batterie HS, ne s'allume plus..."
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label>Prix estimé (€)</label>
              <input
                type="number"
                value={repair.estimatedPrice}
                onChange={(e) => setRepair({ ...repair, estimatedPrice: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="modal-footer">
              <button className="btn-back" onClick={() => setStep(1)}>
                Retour
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={loading || !repair.problemDescription}
              >
                {loading ? 'Création...' : 'Créer la réparation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairForm;