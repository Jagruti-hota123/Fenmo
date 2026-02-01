// Middleware to handle idempotency for POST requests
// Prevents duplicate expense creation on network retries

const idempotencyStore = new Map();
const IDEMPOTENCY_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const idempotencyMiddleware = async (req, res, next) => {
  // Only apply to POST requests
  if (req.method !== 'POST') {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    return next();
  }

  // Check if we've seen this request before
  const cachedResponse = idempotencyStore.get(idempotencyKey);
  
  if (cachedResponse) {
    console.log(`Idempotent request detected: ${idempotencyKey}`);
    return res.status(cachedResponse.status).json(cachedResponse.data);
  }

  // Store the original res.json to intercept the response
  const originalJson = res.json.bind(res);
  
  res.json = function(data) {
    // Cache this response
    idempotencyStore.set(idempotencyKey, {
      status: res.statusCode,
      data: data
    });

    // Clean up old entries periodically
    setTimeout(() => {
      idempotencyStore.delete(idempotencyKey);
    }, IDEMPOTENCY_CACHE_TTL);

    return originalJson(data);
  };

  next();
};

export default idempotencyMiddleware;