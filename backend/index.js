const express = require('express');
const cors = require('cors');
const { skills, cases } = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Find Mr.W API is running' });
});

app.get('/api/skills', (req, res) => {
  res.json({ data: skills });
});

app.get('/api/cases', (req, res) => {
  res.json({ data: cases });
});

app.get('/api/cases/:caseId', (req, res) => {
  const caseItem = cases.find(c => c.id === req.params.caseId);
  if (!caseItem) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.json({ data: caseItem });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Find Mr.W API',
    endpoints: {
      health: '/api/health',
      skills: '/api/skills',
      cases: '/api/cases',
      caseDetail: '/api/cases/:caseId'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Find Mr.W API server running on port ${PORT}`);
});
