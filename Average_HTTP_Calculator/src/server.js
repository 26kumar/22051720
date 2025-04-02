const express = require('express');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { PORT, WINDOW_SIZE, API_ENDPOINTS } = require('./config/constants');
const { calculateAverage, updateWindow } = require('./utils/numbers');
const { fetchNumbers } = require('./utils/api');

// Initialize Express
const app = express();

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

// In-memory storage
const numberWindows = { p: [], f: [], e: [], r: [] };

// Main endpoint
app.get('/numbers/:numberid', async (req, res) => {
  const requestId = uuidv4();
  const numberId = req.params.numberid;
  const startTime = Date.now();
  
  logger.info(`[${requestId}] Processing request for ${numberId}`);

  // Validate input
  if (!API_ENDPOINTS[numberId]) {
    logger.warn(`[${requestId}] Invalid number ID`);
    return res.status(400).json({ error: 'Invalid number ID. Use p, f, e, or r' });
  }

  try {
    // Fetch numbers
    const fetchedNumbers = await fetchNumbers(API_ENDPOINTS[numberId], requestId);
    logger.info(`[${requestId}] Fetched ${fetchedNumbers.length} numbers`);

    // Update window
    const { prevWindow, newWindow } = updateWindow(
      numberWindows[numberId],
      fetchedNumbers,
      WINDOW_SIZE
    );
    numberWindows[numberId] = newWindow;

    // Prepare response
    const response = {
      windowPrevState: prevWindow,
      windowCurrState: newWindow,
      numbers: fetchedNumbers,
      avg: calculateAverage(newWindow)
    };

    // Ensure response time
    const elapsed = Date.now() - startTime;
    if (elapsed < TIMEOUT_MS) {
      logger.info(`[${requestId}] Request completed in ${elapsed}ms`);
      res.json(response);
    } else {
      logger.warn(`[${requestId}] Request timeout`);
      res.status(504).json({ error: 'Request timeout' });
    }
  } catch (error) {
    logger.error(`[${requestId}] Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`Server running at http://localhost:${PORT}`);
});