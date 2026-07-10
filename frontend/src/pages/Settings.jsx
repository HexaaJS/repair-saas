import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import shopService from '../services/shopService';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');

  // Profil
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Équipe
  const [members, setMembers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'technicien',
    shop: '',
  });
  const [addErr, setAddErr] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (tab === 'team') {
      fetchTeam();
      fetchShops();
    }
  }, [tab]);

  const fetchTeam = async () => {
    setLoadingTeam(true);
    try {
      const res = await userService.getTeam();
      setMembers(res.data.data.members);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTeam(false);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await shopService.getAll();
      setShops(res.data.data.shops);
      if (res.data.data.shops.length > 0 && !newMember.shop) {
        setNewMember((prev) => ({ ...prev, shop: res.data.data.shops[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sauvegarder profil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');
    setSavingProfile(true);

    try {
      const data = { ...profile };
      if (!data.password) delete data.password;

      await userService.updateProfile(data);
      setProfileMsg('Profil mis à jour');
      setProfile((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSavingProfile(false);
    }
  };

  // Ajouter membre
  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddErr('');
    setAddingMember(true);

    try {
      await userService.addMember(newMember);
      setShowAddForm(false);
      setNewMember({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'technicien',
        shop: shops[0]?._id || '',
      });
      fetchTeam();
    } catch (err) {
      setAddErr(err.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setAddingMember(false);
    }
  };

  // Désactiver membre
  const handleRemoveMember = async (id) => {
    if (!window.confirm('Désactiver ce membre ?')) return;

    try {
      await userService.removeMember(id);
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="settings-page">
      <h1>Paramètres</h1>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${tab === 'profile' ? 'tab-active' : ''}`}
          onClick={() => setTab('profile')}
        >
          Mon profil
        </button>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button
            className={`settings-tab ${tab === 'team' ? 'tab-active' : ''}`}
            onClick={() => setTab('team')}
          >
            Équipe
          </button>
        )}
      </div>

      {/* Profil */}
      {tab === 'profile' && (
        <div className="settings-card">
          {profileMsg && <div className="settings-success">{profileMsg}</div>}
          {profileErr && <div className="settings-error">{profileErr}</div>}

          <form onSubmit={handleSaveProfile}>
            <div className="form-row">
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nouveau mot de passe (laisser vide pour ne pas changer)</label>
              <input
                type="password"
                value={profile.password}
                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-save" disabled={savingProfile}>
              {savingProfile ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </form>
        </div>
      )}

      {/* Équipe */}
      {tab === 'team' && (
        <div className="settings-card">
          <div className="team-header">
            <h2>Membres de l'équipe</h2>
            {user?.role === 'admin' && (
              <button className="btn-add-member" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Annuler' : '+ Ajouter'}
              </button>
            )}
          </div>

          {/* Formulaire ajout */}
          {showAddForm && (
            <div className="add-member-form">
              {addErr && <div className="settings-error">{addErr}</div>}

              <form onSubmit={handleAddMember}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input
                      type="text"
                      value={newMember.firstName}
                      onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      value={newMember.lastName}
                      onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mot de passe</label>
                    <input
                      type="password"
                      value={newMember.password}
                      onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rôle</label>
                    <select
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    >
                      <option value="technicien">Technicien</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Boutique</label>
                    <select
                      value={newMember.shop}
                      onChange={(e) => setNewMember({ ...newMember, shop: e.target.value })}
                    >
                      {shops.map((shop) => (
                        <option key={shop._id} value={shop._id}>{shop.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-save" disabled={addingMember}>
                  {addingMember ? 'Ajout...' : 'Ajouter le membre'}
                </button>
              </form>
            </div>
          )}

          {/* Liste membres */}
          {loadingTeam ? (
            <p className="team-empty">Chargement...</p>
          ) : members.length === 0 ? (
            <p className="team-empty">Aucun membre dans l'équipe</p>
          ) : (
            <div className="team-list">
              {members.map((member) => (
                <div key={member._id} className={`team-row ${!member.isActive ? 'team-row-inactive' : ''}`}>
                  <div className="team-avatar">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div className="team-info">
                    <p className="team-name">{member.firstName} {member.lastName}</p>
                    <p className="team-email">{member.email}</p>
                  </div>
                  <span className="team-role">{member.role}</span>
                  <span className="team-shop">{member.shop?.name}</span>
                  {user?.role === 'admin' && member.isActive && (
                    <button
                      className="btn-remove-member"
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      Désactiver
                    </button>
                  )}
                  {!member.isActive && (
                    <span className="team-inactive-badge">Inactif</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;