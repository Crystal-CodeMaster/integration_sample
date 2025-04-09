const Database = require('better-sqlite3');

class MedicalDatabase {
  constructor(dbPath = './data.sqlite') {
    this.db = new Database(dbPath);
    this.createTables();
  }

  createTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS Procedures (
        CPT INTEGER PRIMARY KEY NOT NULL,
        ProcedureDescription TEXT,
        RVU REAL,
        ExpectedCollections REAL
      );
      
      CREATE TABLE IF NOT EXISTS Modifiers (
        Modifier INTEGER PRIMARY KEY NOT NULL,
        DiagnosticCriteria TEXT,
        Examples TEXT
      );
    `);
  }

  // Insert or update procedure (upsert)
  upsertProcedure(data) {
    const stmt = this.db.prepare(`
      INSERT INTO Procedures (CPT, ProcedureDescription, RVU, ExpectedCollections)
      VALUES (@CPT, @ProcedureDescription, @RVU, @ExpectedCollections)
      ON CONFLICT(CPT) DO UPDATE SET
        ProcedureDescription = excluded.ProcedureDescription,
        RVU = excluded.RVU,
        ExpectedCollections = excluded.ExpectedCollections
    `);
    return stmt.run(data);
  }

  // Get procedures by CPT code
  getProcedure(cptCode) {
    return this.db.prepare(`
      SELECT * FROM Procedures WHERE CPT = ?
    `).get(cptCode);
  }

  // Export table to JSON file
  exportToJson(tableName, filePath) {
    const data = this.db.prepare(`SELECT * FROM ${tableName}`).all();
    require('fs').writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  }

  close() {
    this.db.close();
  }
}

module.exports = MedicalDatabase;