const { expect } = require("chai");
const supertest = require("supertest");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = require("../app");

describe("API Endpoints (Without Authentication)", () => {
  before(async () => {
    try {
      const testDatabasePath = path.join(__dirname, "test-notesData.db");
      testDatabase = await open({
        filename: testDatabasePath,
        driver: sqlite3.Database,
      });

      await testDatabase.exec(notesData.db);
    } catch (error) {
      console.error("Error setting up the test database:", error);
      process.exit(1);
    }
  });

  after(async () => {
    await testDatabase.close();
  });

  describe("GET /notes", () => {
    it("should return 200 and an array of notes", async () => {
      const res = await supertest(app).get("/notes");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /notes/:noteId with non-existing noteId", () => {
    it("should return 404 and a message 'Note not found'", async () => {
      const res = await supertest(app).get("/notes/1000");
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Note not found");
    });
  });

  describe("POST /notes", () => {
    it("should return 201 for a valid note", async () => {
      const res = await supertest(app).post("/notes").send({
        noteId: 1,
        noteTitle: "Test Note",
        noteContent: "Test content",
      });
      expect(res.status).to.equal(201);
    });
  });

  describe("PUT /notes/:noteId", () => {
    it("should return 200 for a valid note update", async () => {
      const res = await supertest(app)
        .put("/notes/1")
        .send({ noteTitle: "Updated Note", noteContent: "Updated content" });
      expect(res.status).to.equal(200);
    });

    it("should return 404 for updating a non-existing note", async () => {
      const res = await supertest(app)
        .put("/notes/1000")
        .send({ noteTitle: "Updated Note", noteContent: "Updated content" });
      expect(res.status).to.equal(404);
    });
  });

  describe("DELETE /notes/:noteId", () => {
    it("should return 200 for deleting an existing note", async () => {
      const res = await supertest(app).delete("/notes/1");
      expect(res.status).to.equal(200);
    });

    it("should return 404 for deleting a non-existing note", async () => {
      const res = await supertest(app).delete("/notes/1000");
      expect(res.status).to.equal(404);
    });
  });
});
