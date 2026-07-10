import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand-top">
          <div className="login-logo">
            <span className="login-logo-icon">R</span>
            <span className="login-logo-text">RepairSaaS</span>
          </div>
          <h1>Gérez votre atelier.<br />Pas la paperasse.</h1>
          <p>Tickets, clients, stock, facturation.<br />Tout dans un seul outil.</p>
        </div>
        <ul className="login-features">
          <li>Suivi réparation en temps réel</li>
          <li>SMS automatiques aux clients</li>
          <li>Multi-boutiques & multi-techniciens</li>
        </ul>
      </div>

      <div className="login-form-side">
        <div className="login-form-wrapper">
          <h2>Bon retour</h2>
          <p className="login-form-subtitle">Connectez-vous pour accéder à votre espace</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="login-forgot">
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="login-footer">
            Pas encore de compte ? <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;