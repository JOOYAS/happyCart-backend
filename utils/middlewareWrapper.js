//by gpt , to block the res by middleware, and make it return true/false
const wrapMiddleware = (middleware) => (req, res) =>
    new Promise((resolve) => {
        // Temporarily override `res.status` and `res.json`
        const originalStatus = res.status;
        const originalJson = res.json;

        // Override to intercept responses
        res.status = (statusCode) => {
            return {
                json: (data) => {
                    resolve(false); // Middleware failed
                    // Restore original methods to avoid breaking anything
                    res.status = originalStatus;
                    res.json = originalJson;
                    return res; // Chainable
                },
            };
        };

        res.json = (data) => {
            resolve(false); // Middleware failed
            // Restore original methods
            res.status = originalStatus;
            res.json = originalJson;
            return res; // Chainable
        };

        // Call middleware and resolve `true` if it passes
        middleware(req, res, (err) => {
            if (err) {
                resolve(false); // Middleware failed
            } else {
                resolve(true); // Middleware passed
            }

            // Restore original methods in case of success
            res.status = originalStatus;
            res.json = originalJson;
        });
    });

module.exports = wrapMiddleware;
