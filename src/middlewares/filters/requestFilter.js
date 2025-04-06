// /**
//  * Ultimate request filter with all security features
//  * @param {string[]} allowedFields - Whitelisted fields
//  * @param {string[]} requiredFields - Mandatory fields
//  * @param {object} options - Configuration
//  * @param {boolean} [options.stripNulls=true] - Remove null/undefined
//  * @param {boolean} [options.logRejected=true] - Log suspicious fields
//  * @param {boolean} [options.logMissing=true] - Log missing required fields
//  * @returns {Function} Express middleware
//  */
const createRequestFilter = (
  allowedFields,
  requiredFields = [],
  options = {}
) => {
  const { stripNulls = true, logRejected = true, logMissing = true } = options;

  const allowedSet = new Set(allowedFields);
  const requiredSet = new Set(requiredFields);

  return (req, res, next) => {
    // Phase 1: Check required fields
    const missingFields = [];
    requiredSet.forEach((field) => {
      if (!(field in req.body)) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      if (logMissing) {
        console.warn("Missing required fields:", {
          route: req.originalUrl,
          missingFields,
          ip: req.ip,
        });
      }
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
      });
    }

    // Phase 2: Filter and clean fields
    const filteredBody = {};
    const rejectedFields = [];

    Object.entries(req.body).forEach(([key, value]) => {
      if (allowedSet.has(key)) {
        if (!stripNulls || (value !== null && value !== undefined)) {
          filteredBody[key] = value;
        }
      } else if (logRejected) {
        rejectedFields.push(key);
      }
    });

    if (logRejected && rejectedFields.length > 0) {
      console.warn("Rejected suspicious fields:", {
        route: req.originalUrl,
        rejectedFields,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });
    }

    req.body = filteredBody;
    next();
  };
};

module.exports = createRequestFilter;
