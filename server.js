const express = require('express');
const bodyParser = require('body-parser');
const MedicalDatabase = require('./database');

const app = express();
app.use(bodyParser.json());
const db = new MedicalDatabase();

// API Endpoints
app.post('/procedures', (req, res) => {
  const result = db.upsertProcedure(req.body);
  res.json({ success: true, changes: result.changes });
});

app.get('/procedures/:cpt', (req, res) => {
  const procedure = db.getProcedure(req.params.cpt);
  res.json(procedure || { error: 'Not found' });
});

app.get('/export/:table', (req, res) => {
  const success = db.exportToJson(req.params.table, `./exports/${req.params.table}.json`);
  res.json({ success, message: `Exported ${req.params.table} to JSON` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Medical API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`- POST /procedures {CPT, ProcedureDescription, RVU, ExpectedCollections}`);
  console.log(`- GET /procedures/:cpt`);
  console.log(`- GET /export/:table`);
});