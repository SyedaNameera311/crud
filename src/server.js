const app = require('./app');

const PORT = process.env.PORT || 3000;

// Vercel ke liye export zaroori hai
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Dukaan khul gayi http://localhost:${PORT} par`);
  });
}

module.exports = app;