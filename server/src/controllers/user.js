import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectNeonDB from "../db/connectNeonDB.js";
import { v4 as uuidv4 } from "uuid";

import validationErrorMessage from "../util/validationErrorMessage.js";
import { logError } from "../util/logging.js";
import validateAllowedFields from "../util/validateAllowedFields.js";
import { blacklistedTokens } from "../middleware/authVerify.js";

// JWT Configuration

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// SIGNUP - Create a new user

export const createUser = async (req, res) => {
  // Get a new database client and the connection closing function
  const { connectedClient: client, endConnection } = await connectNeonDB();

  try {
    const user = req.body?.user || {};
    const errors = [];

    // 1. Check for disallowed fields (Sanitization/Security)
    const disallowedFieldsError = validateAllowedFields(user, [
      "firstname",
      "lastname",
      "email",
      "password",
    ]);

    if (disallowedFieldsError) {
      // Use validationErrorMessage, wrapping the string in an array
      return res.status(400).json({
        success: false,
        msg: validationErrorMessage([disallowedFieldsError]),
      });
    }

    // 2. Validate required fields
    if (!user.firstname) errors.push("First name is required");
    if (!user.lastname) errors.push("Last name is required");
    if (!user.email) errors.push("Email is required");
    if (!user.password) errors.push("Password is required");

    if (errors.length > 0) {
      // Using validationErrorMessage for 400 response
      return res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errors) });
    }

    // 3. Check if email already exists
    const checkEmail = await client.query(
      "SELECT user_id FROM users WHERE email = $1",
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

    const result = await client.query(
      `INSERT INTO users (user_id, "firstname", "lastname", email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id, "firstname", "lastname", email`, // Do not return the password hash
      [newUserId, user.firstname, user.lastname, user.email, hashedPassword],
    );

    const newUser = result.rows[0]; // Generate JWT (Access Token)

    const token = jwt.sign(
      { id: newUser.user_id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    ); // Respond with user and token

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
  const { connectedClient: client, endConnection } = await connectNeonDB();

  try {
    const { email = "", password = "" } = req.body || {};
    const errors = [];

    // Note: You may want to implement validateAllowedFields here too,
    // but the current request body is destructured directly.

    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");

    if (errors.length > 0) {
      // Using validationErrorMessage for 400 response
      if (endConnection) await endConnection();
      return res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errors) });
    }

    const result = await client.query(
      "SELECT user_id, email, password, firstname, lastname FROM users WHERE email = $1",
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

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    ); // Remove the hash before sending the user object in the response

    delete user.password;

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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(400).json({ success: false, msg: "No token provided" }); // Add the token to the in-memory blacklist

    blacklistedTokens.push(token);

    res.json({ success: true, msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Logout error" });
  }
};
