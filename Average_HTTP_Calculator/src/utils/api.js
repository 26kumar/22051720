const axios = require('axios');
const { TIMEOUT_MS } = require('../config/constants');

const fetchNumbers = async (url, requestId) => {
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data?.numbers || [];
  } catch (error) {
    console.error(`[${requestId}] API Error: ${error.message}`);
    return [];
  }
};

module.exports = { fetchNumbers };