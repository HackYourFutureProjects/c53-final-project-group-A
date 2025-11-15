import connectNeonDB from "./db/connectNeonDB.js";
import { logError, logInfo } from "./util/logging.js";

const testConnectionNeon = async () => {
  const { error, connectedClient, endConnection } = await connectNeonDB();

  if (error) {
    logError("Connection failed:", error.message);
    return;
  }

  try {
    const timeResult = await connectedClient.query("SELECT NOW()");
    logInfo("✓ Connection successful! Current DB Time:", timeResult.rows[0]);

    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    const tablesResult = await connectedClient.query(tablesQuery);

    logInfo("\n:bar_chart: Tables in database:");
    if (tablesResult.rows.length === 0) {
      logInfo("  No tables found");
    } else {
      tablesResult.rows.forEach((row, index) => {
        logInfo(`  ${index + 1}. ${row.table_name}`);
      });
    }

    logInfo("\n:clipboard: Table structures:");
    for (const table of tablesResult.rows) {
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `;
      const columnsResult = await connectedClient.query(columnsQuery, [
        table.table_name,
      ]);

      logInfo(`\n  Table: ${table.table_name}`);
      columnsResult.rows.forEach((col) => {
        logInfo(
          `    - ${col.column_name} (${col.data_type}) ${col.is_nullable === "NO" ? "NOT NULL" : ""}`,
        );
      });
    }
  } catch (err) {
    logError("✗ Query failed:", err.message);
  } finally {
    await endConnection();
  }
};

testConnectionNeon();
