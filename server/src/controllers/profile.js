import connectNeonDB from "../db/connectNeonDB.js";

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

  const query = `
    UPDATE users
    SET ${setParts.join(", ")}
    WHERE userid = $${i}
    RETURNING userid, firstname, lastname, email, avatar, street, housenumber, city, country, skills
  `;

  const {
    connectedClient: client,
    endConnection,
    error,
  } = await connectNeonDB();
  if (error) throw new Error("DB connection error");

  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    if (endConnection) await endConnection();
  }
};
