import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectNeonDB from "../db/connectNeonDB.js";
import { v4 as uuidv4 } from "uuid";

import validationErrorMessage from "../util/validationErrorMessage.js";
import { logError } from "../util/logging.js";
import { blacklistedTokens } from "../middleware/authVerify.js";
import validateCreactUser from "../util/validateCreactUser.js";
import { updateUserProfile } from "./profile.js";

// JWT Configuration

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// The unified query variable
// The query has been corrected to include all user information, including address,  and skills
const USER_FULL_INFO_QUERY = `
    SELECT
        u.userid, u.email, u.password, u.firstname, u.lastname, u.avatar,
        u.street, u.housenumber, u.city, u.country, u.skills,
        
        -- Select ALL columns from the 'favorites' table
        f.* FROM users u
    -- 1. Link users to the bridge table
    LEFT JOIN user_favorites uf ON u.userid = uf.user_id
    -- 2. Link the bridge table to the job/favorite details table
    LEFT JOIN favorites f ON uf.favorite_id = f.id
`;

// SIGNUP - Create a new user

export const createUser = async (req, res) => {
  // Get a new database client and the connection closing function
  const {
    connectedClient: client,
    endConnection,
    error,
  } = await connectNeonDB();
  if (error) {
    return res.status(503).json({
      success: false,
      msg: "Service unavailable. Could not connect to the database.",
    });
  }

  try {
    const user = req.body?.user || {};
    const { valid, errors } = validateCreactUser(user);

    if (!valid) {
      return res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errors) });
    }

    // 3. Check if email already exists
    const checkEmail = await client.query(
      "SELECT userid FROM users WHERE email = $1",
      [user.email],
    );

    if (checkEmail.rows.length > 0) {
      // Corrected use of validationErrorMessage by wrapping the string in an array
      return res.status(400).json({
        success: false,
        msg: validationErrorMessage(["Email already registered"]),
      });
    } // Generate UUID and hash the password (Bcrypt is secure)

    const newUserId = uuidv4();
    const hashedPassword = await bcrypt.hash(user.password, 12); // Insert user into DB using parameterized query for SQL injection prevention

    // Do not return the password hash
    const result = await client.query(
      `INSERT INTO users (userid, "firstname", "lastname", email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING userid, "firstname", "lastname", email`,
      [newUserId, user.firstname, user.lastname, user.email, hashedPassword],
    );

    const newUser = result.rows[0]; // Generate JWT (Access Token)
    newUser.favorites = [];
    const token = jwt.sign(
      { id: newUser.userid, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    ); // Respond with user and token

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: newUser,
      token,
    });
  } catch (err) {
    // Using logError for 500 response
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Sorry, there's an error with the DB. Unable to create user",
    });
  } finally {
    // 💡 Crucial: Ensure the connection is closed regardless of success or failure.
    if (endConnection) await endConnection();
  }
};

// LOGIN - Authenticate user

export const loginUser = async (req, res) => {
  const {
    connectedClient: client,
    endConnection,
    error,
  } = await connectNeonDB();

  if (error) {
    return res.status(503).json({
      success: false,
      msg: "Service unavailable. Could not connect to the database.",
    });
  }

  try {
    const { email = "", password = "" } = req.body || {};
    const errors = [];

    // Note: You may want to implement validateAllowedFields here too,
    // but the current request body is destructured directly.

    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");

    if (errors.length > 0) {
      // Using validationErrorMessage for 400 response
      // Connection will be closed in finally block
      return res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errors) });
    }

    const result = await client.query(
      `${USER_FULL_INFO_QUERY} WHERE u.email = $1`,
      [email],
    );

    if (
      result.rows.length === 0 ||
      !(await bcrypt.compare(password, result.rows[0]?.password))
    ) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    const rows = result.rows;
    const userDataRow = rows[0];

    const user = {
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
        user.favorites.push(jobFavorite);
      }
    });

    const token = jwt.sign({ id: user.userid, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    }); // Remove the hash before sending the user object in the response

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (err) {
    // Using logError for 500 response
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Sorry, there's an error with the DB. Unable to login user",
    });
  } finally {
    // 💡 Crucial: Ensure the connection is closed regardless of success or failure.
    if (endConnection) await endConnection();
  }
};

// LOGOUT - Blacklist JWT token (In-Memory)

export const logoutUser = async (req, res) => {
  try {
    // Extract token from "Bearer <token>" header
    const token = req.cookies?.token;
    if (!token)
      return res.status(400).json({ success: false, msg: "No token provided" }); // Add the token to the in-memory blacklist

    blacklistedTokens.push(token);
    res.clearCookie("token");

    res.json({ success: true, msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Logout error" });
  }
};

export const getMe = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ success: false });

  const {
    connectedClient: client,
    endConnection,
    error,
  } = await connectNeonDB();
  if (error) {
    return res.status(503).json({
      success: false,
      msg: "Service unavailable. Could not connect to the database.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await client.query(
      `${USER_FULL_INFO_QUERY} WHERE u.userid = $1`,
      [decoded.id],
    );

    if (result.rows.length === 0) return res.json({ success: false });
    const rows = result.rows;
    const userDataRow = rows[0];

    const user = {
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
        user.favorites.push(jobFavorite);
      }
    });

    res.json({ success: true, user: user });
  } catch (err) {
    res.json({ success: false });
  } finally {
    if (endConnection) await endConnection();
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const fields = req.body;

  try {
    const updatedUser = await updateUserProfile(userId, fields);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err instanceof Error ? err.message : "Update error",
    });
  }
};
