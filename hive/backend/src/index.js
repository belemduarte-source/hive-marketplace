// Local development entry point — not used by Vercel
const app = require('./app');
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Hive backend running on http://localhost:${PORT}`);
});
