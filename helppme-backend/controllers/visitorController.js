const pool = require("../models/admin"); 

// Controller to handle visitor counts
exports.visitorCounts = async (req, res) => {
    try {
        // Get today's date (YYYY-MM-DD)
        const today = new Date().toISOString().slice(0, 10);

        // Try to update today's count
        const [result] = await pool.query(
            `INSERT INTO website_visitors (date, visitor_count)
       VALUES (?, 1)
       ON DUPLICATE KEY UPDATE visitor_count = visitor_count + 1`,
            [today]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Controller to get visitor data for a specific range
exports.getVisitorData = async (req, res) => {
    const range = parseInt(req.query.range) || 30;
    try {
        const [rows] = await pool.query(
            `SELECT DATE(date) as date, SUM(visitor_count) as visitor_count
             FROM website_visitors
             WHERE date >= CURDATE() - INTERVAL ? DAY
             GROUP BY DATE(date)
             ORDER BY DATE(date) ASC`,
            [range - 1]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch visitor data" });
    }
}