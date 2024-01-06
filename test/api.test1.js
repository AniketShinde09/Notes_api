const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../app");
describe("API Endpoints (Without Authentication)", () => {
  before(async () => {
    try {
      const database = await open({
        filename: ":memory:",
        driver: sqlite3.Database,
      });

      await database.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY,
        title TEXT,
        content TEXT
      );
    `);

      await database.exec(`
      INSERT INTO notes (title, content) VALUES
        ('Note 1', 'Content of Note 1'),
        ('Note 2', 'Content of Note 2');
    `);

      global.testDatabase = database;
    } catch (error) {
      console.error("Error setting up test database:", error);
      process.exit(1);
    }
  });

  after(async () => {
    try {
      const database = global.testDatabase;

      if (database) {
        await database.close();
        console.log("Test database connection closed.");
      }
    } catch (error) {
      console.error("Error cleaning up test database:", error);
    }
  });

  describe("GET /notes", () => {
    it("should return a list of notes without authentication", async () => {
      const res = await supertest(app).get("/notes");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /notes/:noteId", () => {
    it("should return a single note by ID without authentication", async () => {
      const res = await supertest(app).get("/notes/1");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("title");
      expect(res.body).to.have.property("content");
    });

    it("should return 404 for non-existing note ID without authentication", async () => {
      const res = await supertest(app).get("/notes/999");

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Note not found");
    });
  });
});
