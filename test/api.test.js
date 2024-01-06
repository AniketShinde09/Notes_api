const { expect } = require("chai");
const supertest = require("supertest");
const { app, database } = require("./setup");

describe("API Endpoints", () => {
  
  before(async () => {
    
    await database.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY,
        title TEXT,
        content TEXT
      );
    `);

    await database.run(`
      INSERT INTO notes (title, content) VALUES
      ('Test Note 1', 'Content for Test Note 1'),
      ('Test Note 2', 'Content for Test Note 2');
    `);
  });

  
  after(async () => {
   
    await database.close();
  });

  describe("GET /notes", () => {
    it("should return a list of notes", async () => {
      const res = await supertest(app).get("/notes");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.equal(2); 
  });

  describe("GET /notes/:noteId", () => {
    it("should return a single note by ID", async () => {
      const res = await supertest(app).get("/notes/1");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("title");
      expect(res.body).to.have.property("content");
    });

    it("should return 404 for non-existing note ID", async () => {
      const res = await supertest(app).get("/notes/999");
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Note not found");
    });
  });


});
