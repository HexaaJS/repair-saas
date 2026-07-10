import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import shopService from '../services/shopService';
import './Shops.css';

const Shops = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    siret: '',
    address: { street: '', city: '', zipCode: '' },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchShops = async () => {
    try {
      const res = await shopService.getAll();
      setShops(res.data.data.shops);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const openAdd = () => {
    setEditingShop(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      siret: '',
      address: { street: '', city: '', zipCode: '' },
    });
    setError('');
    setShowForm(true);
  };

  const openEdit = (shop) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name || '',
      phone: shop.phone || '',
      email: shop.email || '',
      siret: shop.siret || '',
      address: {
        street: shop.address?.street || '',
        city: shop.address?.city || '',
        zipCode: shop.address?.zipCode || '',
      },
    });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (editingShop) {
        await shopService.update(editingShop._id, formData);
      } else {
        await shopService.create(formData);
      }
      setShowForm(false);
      fetchShops();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Désactiver cette boutique ?')) return;

    try {
      await shopService.remove(id);
      fetchShops();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="shops-page">
      <div className="shops-header">
        <div>
          <h1>Boutiques</h1>
          <p className="shops-count">{shops.length} boutique{shops.length > 1 ? 's' : ''}</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn-add-shop" onClick={openAdd}>
            + Ajouter une boutique
          </button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="shop-form-card">
          <div className="shop-form-header">
            <h2>{editingShop ? 'Modifier la boutique' : 'Nouvelle boutique'}</h2>
            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
          </div>

          {error && <div className="shop-form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nom de la boutique</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: 2A Mobile"
                  required
                />
              </div>
              <div className="form-group">
                <label>SIRET</label>
                <input
                  type="text"
                  value={formData.siret}
                  onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                  placeholder="123 456 789 00012"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Adresse</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
                }
                placeholder="Rue"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ville</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
                  }
                />
              </div>
              <div className="form-group">
                <label>Code postal</label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })
                  }
                />
              </div>
            </div>

            <div className="shop-form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                Annuler
              </button>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? 'Sauvegarde...' : editingShop ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <p className="shops-empty">Chargement...</p>
      ) : shops.length === 0 ? (
        <p className="shops-empty">Aucune boutique</p>
      ) : (
        <div className="shops-grid">
          {shops.map((shop) => (
            <div key={shop._id} className={`shop-card ${!shop.isActive ? 'shop-inactive' : ''}`}>
              <div className="shop-card-header">
                <div className="shop-icon">🏪</div>
                <div>
                  <h3>{shop.name}</h3>
                  {!shop.isActive && <span className="shop-inactive-badge">Inactive</span>}
                </div>
              </div>

              <div className="shop-card-infos">
                {shop.address?.street && (
                  <p className="shop-address">
                    {shop.address.street}, {shop.address.zipCode} {shop.address.city}
                  </p>
                )}
                {shop.phone && <p className="shop-detail">📞 {shop.phone}</p>}
                {shop.email && <p className="shop-detail">✉️ {shop.email}</p>}
                {shop.siret && <p className="shop-detail">🏛️ SIRET: {shop.siret}</p>}
              </div>

              <p className="shop-created">
                Créée le {new Date(shop.createdAt).toLocaleDateString('fr-FR')}
              </p>

              {user?.role === 'admin' && shop.isActive && (
                <div className="shop-card-actions">
                  <button className="btn-edit-shop" onClick={() => openEdit(shop)}>
                    Modifier
                  </button>
                  <button className="btn-deactivate-shop" onClick={() => handleDeactivate(shop._id)}>
                    Désactiver
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shops;