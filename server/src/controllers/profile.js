import connectNeonDB from "../db/connectNeonDB.js";

const USER_FULL_INFO_QUERY = `
    SELECT
        u.userid, u.email, u.password, u.firstname, u.lastname, u.avatar,
        u.street, u.housenumber, u.city, u.country, u.skills,
        f.* FROM users u
    LEFT JOIN user_favorites uf ON u.userid = uf.user_id
    LEFT JOIN favorites f ON uf.favorite_id = f.id
`;

export const updateUserProfile = async (userId, fieldsToUpdate) => {
  let setParts = [];
  let values = [];
  let i = 1;

  for (const key in fieldsToUpdate) {
    if (fieldsToUpdate[key] !== undefined) {
      let value = fieldsToUpdate[key];

      if (key === "skills") {
        if (Array.isArray(value)) value = value.join(",");
        else if (value === null) value = null;
        else value = String(value);
      }

      setParts.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }
  }

  if (setParts.length === 0) throw new Error("No fields provided to update");

  values.push(userId);
  const updateUserIdIndex = i;
  const updateQuery = `
    UPDATE users
    SET ${setParts.join(", ")}
    WHERE userid = $${updateUserIdIndex}
  `;

  const { connectedClient, endConnection, error } = await connectNeonDB();
  if (error) throw new Error("DB connection error");

  try {
    await connectedClient.query(updateQuery, values);

    const fetchQuery = `${USER_FULL_INFO_QUERY} WHERE u.userid = $1`;
    const result = await connectedClient.query(fetchQuery, [userId]);

    if (result.rows.length === 0) {
      throw new Error("User not found after update");
    }

    const rows = result.rows;
    const userDataRow = rows[0];

    const updatedUser = {
      userid: userDataRow.userid,
      email: userDataRow.email,
      firstname: userDataRow.firstname,
      lastname: userDataRow.lastname,
      avatar: userDataRow.avatar,
      street: userDataRow.street,
      housenumber: userDataRow.housenumber,
      city: userDataRow.city,
      country: userDataRow.country,
      skills: userDataRow.skills
        ? userDataRow.skills.split(",").map((skill) => skill.trim())
        : [],
      favorites: [],
    };

    rows.forEach((row) => {
      if (row.id) {
        const jobFavorite = {
          id: row.id,
          date_posted: row.date_posted,
          title: row.title,
          organization: row.organization,
          organization_url: row.organization_url,
          employment_type: row.employment_type,
          url: row.url,
          organization_logo: row.organization_logo,
          display_location: row.display_location,
          work_mode: row.work_mode,
          linkedin_org_url: row.linkedin_org_url,
          seniority: row.seniority,
          description_text: row.description_text,
          travel_time: row.travel_time,
          least_transfers: row.least_transfers,
          normalized_description: row.normalized_description,
        };
        updatedUser.favorites.push(jobFavorite);
      }
    });

    return updatedUser;
  } finally {
    if (endConnection) await endConnection();
  }
};
