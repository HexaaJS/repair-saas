const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { env, isDev, isProd, port, client, mongo } = require('./config/env');

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors({ origin: client.url, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isDev) {
  app.use(morgan('dev'));
}

// Route de test
app.get('/', (req, res) => {
  res.json({ status: 'ok', env });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/shops', require('./routes/shop.routes'));
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/repairs', require('./routes/repair.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));

// Error handler (toujours en dernier)
app.use(require('./middlewares/errorHandler'));

// Démarrage
const start = async () => {
  await connectDB();

  app.listen(port, () => {
    const dbName = mongo.uri.split('/').pop().split('?')[0];

    console.log('');
    console.log('╔══════════════════════════════════════════════╗');

    if (isDev) {
      console.log('║   🔧  MODE DÉVELOPPEMENT                     ║');
    } else {
      console.log('║   🚀  MODE PRODUCTION                        ║');
    }

    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║   📡  Serveur  : http://localhost:${port}        ║`);
    console.log(`║   📦  BDD      : ${dbName.padEnd(27)}║`);
    console.log(`║   🌐  Client   : ${(client.url || 'non défini').padEnd(27)}║`);
    console.log(`║   📄  Env file : .env.${env.padEnd(22)}║`);
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
  });
};

start();