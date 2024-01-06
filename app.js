const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "notesData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertNoteDbObjectToResponseObject = (dbObject) => {
  return {
    title: dbObject.title,
  };
};

app.get("/notes/", async (request, response) => {
  try {
    const getNotesQuery = "SELECT * FROM notes;";
    const notesArray = await database.all(getNotesQuery);

    console.log("Notes from the database:", notesArray);

    const mappedNotes = notesArray.map((eachNote) =>
      convertNoteDbObjectToResponseObject1(eachNote)
    );

    response.send(mappedNotes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    response.status(500).send(`Error: ${error.message}`);
  }
});

const convertNoteDbObjectToResponseObject1 = (dbObject) => {
  return {
    id: dbObject.id,
    title: dbObject.title,
    content: dbObject.content,
  };
};

app.get("/notes/:noteId/", async (request, response) => {
  try {
    const { noteId } = request.params;
    const getNoteQuery = "SELECT * FROM notes WHERE id = ?;";
    const note = await database.get(getNoteQuery, [noteId]);

    if (!note) {
      response.status(404).send("Note not found");
      return;
    }

    response.send(convertNoteDbObjectToResponseObject1(note));
  } catch (error) {
    console.error("Error fetching note:", error);
    response.status(500).send(`Error: ${error.message}`);
  }
});

app.post("/notes/", async (request, response) => {
  try {
    const { noteId, noteTitle, noteContent } = request.body;

    if (!noteId || !noteTitle || !noteContent) {
      response
        .status(400)
        .send(
          "Invalid request. Please provide noteId, noteTitle, and noteContent."
        );
      return;
    }

    const postNoteQuery =
      "INSERT INTO notes (id, title, content) VALUES (?, ?, ?);";
    await database.run(postNoteQuery, [noteId, noteTitle, noteContent]);

    response.status(201).send("Note Successfully Added"); // 201 status for successful creation
  } catch (error) {
    console.error("Error adding note:", error);
    response.status(500).send(`Error: ${error.message}`);
  }
});

app.put("/notes/:noteId/", async (request, response) => {
  const { noteTitle, noteContent } = request.body;
  const { noteId } = request.params;
  const updateNoteQuery = `
            UPDATE
              notes
            SET
              id = ${noteId},
              title = '${noteTitle}',
              content = '${noteContent}'
            WHERE
              id = ${noteId};`;

  await database.run(updateNoteQuery);
  response.send("Note Details Updated");
});

app.delete("/notes/:noteId/", async (request, response) => {
  const { noteId } = request.params;
  const deleteNoteQuery = `
  DELETE FROM
    notes
  WHERE
    id = ${noteId};`;
  await database.run(deleteNoteQuery);
  response.send("Note Removed");
});

module.exports = app;
