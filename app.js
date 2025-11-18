const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// making change 1 to trigger the code QA scan
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//test 11

// Routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Express App</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #333; }
          .endpoints {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Express Server is Running!</h1>
          <p>Welcome to your Node.js Express application.</p>
          <div class="endpoints">
            <h3>Available Endpoints:</h3>
            <ul>
              <li><strong>GET /</strong> - This home page</li>
              <li><strong>GET /api/hello</strong> - Simple API endpoint</li>
              <li><strong>POST /api/echo</strong> - Echo back JSON data</li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  `);
});


app.get('/ping', (req, res) => {
  const host = req.query.host;
  // ⚠️ Command Injection vulnerability - CodeQL should detect this
  exec(`ping ${host}`, (error, stdout, stderr) => {
    if (error) {
      res.send(`Error: ${error.message}`);
      return;
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from Express API!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

app.post('/api/echo', (req, res) => {
  res.json({
    message: 'Echo endpoint',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
