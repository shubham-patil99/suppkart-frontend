const express = require("express");
const compression = require("compression");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = require("next")({ dev: process.env.NODE_ENV !== "production" });

const blockedIPs = new Map(); // Store blocked IPs with unblock timestamps

app.prepare().then(() => {
  const server = express();

  server.use(cors({ origin: "*" }));
  server.use(compression());
  server.use(express.static("express-static"));

  // Middleware to check if IP is blocked
  server.use((req, res, next) => {
    const userIP = req.ip;
    const unblockTime = blockedIPs.get(userIP);

    if (unblockTime && Date.now() < unblockTime) {
      return res.status(403).json({
        error: "Your IP is temporarily blocked. Try again later.",
      });
    } else if (unblockTime && Date.now() >= unblockTime) {
      blockedIPs.delete(userIP); // Auto Unblock IP
    }

    next();
  });

  // Rate limiter middleware
  const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 150, // Max 150 requests per window
    handler: (req, res) => {
      const userIP = req.ip;
      const unblockTime = Date.now() + 20 * 60 * 1000; // 20 minutes block

      blockedIPs.set(userIP, unblockTime); // Store IP block time

      res.status(429).json({
        error: "Too many requests, you are blocked for 20 minutes.",
      });
    },
    keyGenerator: (req) => req.ip, // Block by IP
    standardHeaders: true,
    legacyHeaders: false,
  });

  server.use(limiter);

  // Handle the route to redirect with lowercase category slugs
  server.get("/all-product/category/:id/:category/:category2", (req, res) => {
    const { id, category, category2 } = req.params;

    // Convert categories to lowercase
    const lowerCategory = category.toLowerCase();
    const lowerCategory2 = category2.toLowerCase();

    // Redirect to the new lowercase URL
    res.redirect(301, `/category/${lowerCategory}-${lowerCategory2}?id=${id}`);
  });

  // Route to check if an IP is blocked
  server.get("/check-ip", (req, res) => {
    const userIP = req.query.ip;
    const unblockTime = blockedIPs.get(userIP);

    if (unblockTime && Date.now() < unblockTime) {
      return res.json({
        blocked: true,
        unblock_at: new Date(unblockTime).toISOString(),
      });
    }
    return res.json({ blocked: false });
  });

  // Default handler for other routes
  server.all("*", (req, res) => app.getRequestHandler()(req, res));

  const PORT = process.env.PORT || 4004;
  server.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
  });
});
