import connectNeonDB from "../db/connectNeonDB.js";

export const toggleFavoriteJob = async (req, res) => {
  const userId = req.user?.id;
  const { job } = req.body;
  const jobId = job?.id;

  //  Check if user is authenticated
  if (!userId)
    return res
      .status(401)
      .json({ success: false, msg: "User not authenticated" });

  //  Check if jobId is provided
  if (!jobId)
    return res.status(400).json({ success: false, msg: "job.id is required" });

  //  Validate job object
  if (!job || !job.title) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid job: title is required" });
  }

  const { connectedClient, endConnection, error } = await connectNeonDB();

  //  Handle database connection error
  if (error)
    return res
      .status(503)
      .json({ success: false, msg: "Database connection error" });

  try {
    // Check if the job exists in the favorites table
    const existingFavorite = await connectedClient.query(
      "SELECT id FROM favorites WHERE id = $1",
      [jobId],
    );

    // 2️ If it does not exist → insert it into the favorites table
    //  Best practice: Consider using transactions when inserting multiple tables
    if (existingFavorite.rows.length === 0) {
      await connectedClient.query(
        `INSERT INTO favorites 
          (id, title, organization, organization_url, employment_type, url, 
           organization_logo, display_location, work_mode, seniority, description_text,
           date_posted, travel_time, least_transfers, normalized_description)
         VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        [
          jobId,
          job.title || null, //  Using null fallback is good to avoid errors
          job.organization || null,
          job.organization_url || null,
          job.employment_type || null,
          job.url || null,
          job.organization_logo || null,
          job.display_location || null,
          job.work_mode || null,
          job.seniority || null,
          job.description_text || null,
          job.date_posted || null,
          job.travel_time || null,
          job.least_transfers || null,
          job.normalized_description || null,
        ],
      );
    }

    // 3️ Check if this favorite exists for this user
    const exists = await connectedClient.query(
      "SELECT 1 FROM user_favorites WHERE user_id = $1 AND favorite_id = $2",
      [userId, jobId],
    );

    if (exists.rows.length > 0) {
      //  Remove favorite
      //  Best practice: Consider wrapping delete and insert operations in a transaction
      await connectedClient.query(
        "DELETE FROM user_favorites WHERE user_id = $1 AND favorite_id = $2",
        [userId, jobId],
      );
      return res.json({ success: true, action: "removed", jobId });
    }

    //  Add favorite
    await connectedClient.query(
      "INSERT INTO user_favorites (user_id, favorite_id) VALUES ($1, $2)",
      [userId, jobId],
    );

    return res.json({ success: true, action: "added", jobId });
  } catch (err) {
    console.error("Toggle favorite error:", err);
    return res
      .status(500)
      .json({ success: false, msg: "Failed to toggle favorite" });
  } finally {
    // Always close the database connection
    if (endConnection) await endConnection();
  }
};
