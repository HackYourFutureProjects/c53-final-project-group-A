// import connectNeonDB from "../db/connectNeonDB.js";

// export const addSkill = async (req, res) => {
//   const userId = req.user?.id;
//   const { skill } = req.body;

//   //  Check if user is authenticated
//   if (!userId)
//     return res
//       .status(401)
//       .json({ success: false, msg: "User not authenticated" });

//   //  Check if jobId is provided
//   if (!jobId)
//     return res.status(400).json({ success: false, msg: "jobId is required" });

//   //  Validate jobData object
//   if (!jobData || !jobData.title) {
//     return res
//       .status(400)
//       .json({ success: false, msg: "Invalid jobData: title is required" });
//   }

//   const {
//     connectedClient: client,
//     endConnection,
//     error,
//   } = await connectNeonDB();

//   //  Handle database connection error
//   if (error)
//     return res
//       .status(503)
//       .json({ success: false, msg: "Database connection error" });

//   try {
//     // Check if the job exists in the favorites table
//     const existingFavorite = await client.query(
//       "SELECT id FROM favorites WHERE id = $1",
//       [jobId],
//     );

//     // 2️ If it does not exist → insert it into the favorites table
//     //  Best practice: Consider using transactions when inserting multiple tables
//     if (existingFavorite.rows.length === 0) {
//       await client.query(
//         `INSERT INTO favorites
//           (id, title, organization, organization_url, employment_type, url,
//            organization_logo, display_location, work_mode, seniority, description_text,
//            date_posted, travel_time, least_transfers, normalized_description)
//          VALUES
//           ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
//         [
//           jobId,
//           jobData.title || null, //  Using null fallback is good to avoid errors
//           jobData.organization || null,
//           jobData.organization_url || null,
//           jobData.employment_type || null,
//           jobData.url || null,
//           jobData.organization_logo || null,
//           jobData.display_location || null,
//           jobData.work_mode || null,
//           jobData.seniority || null,
//           jobData.description_text || null,
//           jobData.date_posted || null,
//           jobData.travel_time || null,
//           jobData.least_transfers || null,
//           jobData.normalized_description || null,
//         ],
//       );
//     }

//     // 3️ Check if this favorite exists for this user
//     const exists = await client.query(
//       "SELECT 1 FROM user_favorites WHERE user_id = $1 AND favorite_id = $2",
//       [userId, jobId],
//     );

//     if (exists.rows.length > 0) {
//       //  Remove favorite
//       //  Best practice: Consider wrapping delete and insert operations in a transaction
//       await client.query(
//         "DELETE FROM user_favorites WHERE user_id = $1 AND favorite_id = $2",
//         [userId, jobId],
//       );
//       return res.json({ success: true, action: "removed", jobId });
//     }

//     //  Add favorite
//     await client.query(
//       "INSERT INTO user_favorites (user_id, favorite_id) VALUES ($1, $2)",
//       [userId, jobId],
//     );

//     return res.json({ success: true, action: "added", jobId });
//   } catch (err) {
//     console.error("Toggle favorite error:", err);
//     return res
//       .status(500)
//       .json({ success: false, msg: "Failed to toggle favorite" });
//   } finally {
//     // Always close the database connection
//     if (endConnection) await endConnection();
//   }
// };
