const { onRequest } = require('firebase-functions/v2/https');
const next = require('next');

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();

exports.nextjsFunc = onRequest(
  {
    region: 'us-central1',
    memory: '1GiB',
    timeoutSeconds: 60,
  },
  async (req, res) => {
    await app.prepare();
    return handle(req, res);
  }
); 