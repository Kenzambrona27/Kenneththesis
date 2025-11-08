const db = require('../config/db');

// ✅ CREATE Activity
exports.createActivity = async (req, res) => {
  try {
    const { subject_id, instructor_id, title, description, type, config_json } = req.body;

    if (!title || !type || !instructor_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO activities (subject_id, instructor_id, title, description, type, config_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [subject_id, instructor_id, title, description, type, JSON.stringify(config_json)]
    );

    res.status(201).json({ message: "Activity created successfully", activity_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create activity" });
  }
};

// ✅ READ All Activities
exports.getActivities = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM activities`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

// ✅ READ Activity by ID
exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`SELECT * FROM activities WHERE activity_id = ?`, [id]);

    if (rows.length === 0) return res.status(404).json({ message: "Activity not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};

// ✅ UPDATE Activity
exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, config_json } = req.body;

    const [result] = await db.query(
      `UPDATE activities SET title=?, description=?, type=?, config_json=?, updated_at=NOW() WHERE activity_id=?`,
      [title, description, type, JSON.stringify(config_json), id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Activity not found" });
    res.json({ message: "Activity updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update activity" });
  }
};

// ✅ DELETE Activity
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(`DELETE FROM activities WHERE activity_id=?`, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Activity not found" });

    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete activity" });
  }
};
