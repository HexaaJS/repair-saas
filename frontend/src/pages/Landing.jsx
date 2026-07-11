import { Link } from 'react-router-dom';
import './Landing.css';

const features = [
  {
    icon: '🔧',
    title: 'Tickets de réparation',
    desc: 'Créez un ticket en 30 secondes. Marque, modèle, panne, code de déverrouillage — tout est centralisé.',
  },
  {
    icon: '📱',
    title: 'Suivi client par SMS',
    desc: 'Vos clients reçoivent un SMS à chaque étape. Fini les appels "c\'est prêt ?".',
  },
  {
    icon: '📦',
    title: 'Gestion de stock',
    desc: 'Pièces détachées, alertes seuil bas, historique fournisseurs. Tout est tracé.',
  },
  {
    icon: '📄',
    title: 'Devis & Facturation',
    desc: 'Devis en 2 clics, factures conformes, TVA automatique, export comptable.',
  },
  {
    icon: '🏪',
    title: 'Multi-boutiques',
    desc: 'Gérez 1 ou 10 points de vente depuis un seul dashboard. Comparez, transférez, pilotez.',
  },
  {
    icon: '👥',
    title: 'Gestion d\'équipe',
    desc: 'Admin, manager, technicien. Chacun voit ce qu\'il doit voir, ni plus ni moins.',
  },
  {
    icon: '📊',
    title: 'Statistiques',
    desc: 'CA, réparations par type, temps moyen, performance par technicien. Décidez avec des données.',
  },
  {
    icon: '🔒',
    title: 'Sécurisé',
    desc: 'Données hébergées en France, chiffrées, sauvegardées. Conforme RGPD.',
  },
];

const pricing = [
  {
    name: 'Solo',
    price: '29',
    desc: '1 boutique, 1 utilisateur',
    features: [
      'Tickets illimités',
      'Suivi client par SMS',
      'Facturation',
      'Support email',
    ],
  },
  {
    name: 'Pro',
    price: '59',
    desc: '1 boutique, utilisateurs illimités',
    popular: true,
    features: [
      'Tout Solo +',
      'Multi-techniciens',
      'Gestion de stock',
      'Statistiques avancées',
      'Support prioritaire',
    ],
  },
  {
    name: 'Réseau',
    price: '99',
    desc: 'Boutiques illimitées',
    features: [
      'Tout Pro +',
      'Multi-boutiques',
      'Transfert de stock',
      'Dashboard réseau',
      'Account manager dédié',
    ],
  },
];

const Landing = () => {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-logo">
            <span className="landing-logo-icon">R</span>
            <span className="landing-logo-text">RepairSaaS</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Fonctionnalités</a>
            <a href="#pricing">Tarifs</a>
            <Link to="/login" className="landing-nav-login">Se connecter</Link>
            <Link to="/register" className="landing-nav-cta">Essai gratuit</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <span className="landing-badge">Nouveau — Notifications SMS automatiques 🎉</span>
          <h1>Le logiciel de gestion<br />pour les ateliers de réparation</h1>
          <p className="landing-hero-sub">
            Téléphones, ordinateurs, tablettes, consoles, trottinettes.<br />
            Gérez vos réparations, clients et factures en un seul endroit.
          </p>
          <div className="landing-hero-actions">
            <Link to="/register" className="landing-btn-primary">Commencer gratuitement</Link>
            <a href="#features" className="landing-btn-secondary">Découvrir</a>
          </div>
          <p className="landing-hero-note">Essai 14 jours gratuit · Sans carte bancaire</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="landing-proof">
        <div className="landing-proof-inner">
          <div className="proof-stat">
            <span className="proof-number">500+</span>
            <span className="proof-label">Boutiques</span>
          </div>
          <div className="proof-stat">
            <span className="proof-number">50 000+</span>
            <span className="proof-label">Réparations gérées</span>
          </div>
          <div className="proof-stat">
            <span className="proof-number">4.8/5</span>
            <span className="proof-label">Satisfaction client</span>
          </div>
          <div className="proof-stat">
            <span className="proof-number">2min</span>
            <span className="proof-label">Pour créer un ticket</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <div className="landing-features-inner">
          <h2>Tout ce qu'il faut pour gérer votre atelier</h2>
          <p className="landing-features-sub">
            Un outil conçu par et pour les réparateurs. Pas un logiciel générique adapté à la va-vite.
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-how">
        <div className="landing-how-inner">
          <h2>Comment ça marche</h2>
          <div className="how-steps">
            <div className="how-step">
              <span className="how-number">1</span>
              <h3>Le client arrive</h3>
              <p>Vous créez un ticket en 30 secondes. Il repart avec un reçu et un lien de suivi par SMS.</p>
            </div>
            <div className="how-step">
              <span className="how-number">2</span>
              <h3>Vous réparez</h3>
              <p>Changez le statut en un clic. Le client est notifié automatiquement à chaque étape.</p>
            </div>
            <div className="how-step">
              <span className="how-number">3</span>
              <h3>Il récupère</h3>
              <p>Facture en 2 clics, encaissement, et le client repart satisfait. Historique complet sauvegardé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="landing-pricing" id="pricing">
        <div className="landing-pricing-inner">
          <h2>Des tarifs simples et transparents</h2>
          <p className="landing-pricing-sub">Sans engagement. Changez de plan à tout moment.</p>
          <div className="pricing-grid">
            {pricing.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'pricing-popular' : ''}`}>
                {plan.popular && <span className="pricing-badge">Le plus populaire</span>}
                <h3>{plan.name}</h3>
                <div className="pricing-price">
                  <span className="pricing-amount">{plan.price}</span>
                  <span className="pricing-period">€/mois</span>
                </div>
                <p className="pricing-desc">{plan.desc}</p>
                <ul className="pricing-features">
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <Link to="/register" className={`pricing-btn ${plan.popular ? 'pricing-btn-primary' : ''}`}>
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="landing-cta">
        <div className="landing-cta-inner">
          <h2>Prêt à simplifier votre atelier ?</h2>
          <p>Rejoignez les centaines de réparateurs qui gagnent du temps chaque jour.</p>
          <Link to="/register" className="landing-btn-primary">Créer mon compte gratuitement</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-brand">
            <div className="landing-nav-logo">
              <span className="landing-logo-icon">R</span>
              <span className="landing-logo-text">RepairSaaS</span>
            </div>
            <p>Le logiciel de gestion pour les ateliers de réparation.</p>
          </div>
          <div className="footer-links">
            <h4>Produit</h4>
            <a href="#features">Fonctionnalités</a>
            <a href="#pricing">Tarifs</a>
          </div>
          <div className="footer-links">
            <h4>Légal</h4>
            <a href="#">CGU</a>
            <a href="#">Confidentialité</a>
            <a href="#">Mentions légales</a>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <a href="mailto:contact@repairsaas.fr">contact@repairsaas.fr</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 RepairSaaS. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;