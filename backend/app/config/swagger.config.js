/**
 * OpenAPI 3.0 / Swagger Spec Generator & Docs Interface
 */
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ASCENDRA Enterprise Platform API',
    version: '1.0.0',
    description: 'Production-ready OpenAPI specification for ASCENDRA AI Operating System backend architecture.',
    contact: {
      name: 'ASCENDRA Architecture Engineering',
      email: 'architecture@ascendra.ai'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development Server'
    }
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Full Enterprise System Health Check',
        description: 'Returns detailed health report including MongoDB connection state, uptime, and memory metrics.',
        responses: {
          200: {
            description: 'System is healthy'
          },
          503: {
            description: 'System database unavailable'
          }
        }
      }
    },
    '/health/liveness': {
      get: {
        summary: 'Kubernetes Liveness Probe',
        responses: {
          200: { description: 'Application is alive' }
        }
      }
    },
    '/health/readiness': {
      get: {
        summary: 'Kubernetes Readiness Probe',
        responses: {
          200: { description: 'Application ready for traffic' },
          503: { description: 'Application database not ready' }
        }
      }
    },
    '/api/v1/system/flags': {
      get: {
        summary: 'List Feature Flags',
        responses: {
          200: { description: 'Feature flags list' }
        }
      }
    }
  }
};

const swaggerMiddleware = (req, res) => {
  if (req.path === '/api/docs.json') {
    return res.json(openApiSpec);
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>ASCENDRA Enterprise API Documentation</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
      <style>
        body { margin: 0; padding: 0; background: #fafafa; font-family: sans-serif; }
        .swagger-ui .topbar { display: none; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          SwaggerUIBundle({
            url: "/api/docs.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [SwaggerUIBundle.presets.apis]
          });
        };
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};

module.exports = {
  openApiSpec,
  swaggerMiddleware
};
