**Notes Application API**

This project is a simple note-taking application API developed using Node.js and Express.js, integrated with an SQLite3 database for data persistence. The API supports CRUD operations (Create, Read, Update, Delete) for notes.

**Table of Contents**

**Notes Table**

| Column  | Type |
| ------- | ---- |
| id      | INT  |
| title   | TEXT |
| content | TEXT |

**Setup**

1. Clone the repository:

   git clone https://github.com/AniketShinde09/Notes_api

   cd notes-app-api

2. Install dependencies:

   Use `npm install` to install the packages.

3. Run the application:

   `nodemon start`

The API should now be running locally on the specified port.

**Dependencies**

This project uses the following dependencies:

express: Web application framework for Node.js.

sqlite3: SQLite database library.

path: Link directory to database.

nodemon: Starting server automatically.

Install these dependencies using npm install.

**Database Integration**

The application is connected to an SQLite3 database to persist notes.

**Testing**

**Dependencies**

npm install --save-dev mocha chai supertest

To run tests for the application, use the following command:

npx mocha test

This project includes unit and integration tests to ensure reliability and performance.

**Documentation**

API endpoints and how to interact with them are documented below.


**API Endpoints**

### API 1

#### Path: `/notes/`

#### Method: `GET`

#### Description:

Returns a list of all notes names in the notes table

#### Response

```
[
  {
    "id": 1,
    "title": "New Note",
    "content": "This is the content of the new note"
  },

  ...
]
```

### API 2

#### Path: `/notes/`

#### Method: `POST`

#### Description:

Creates a new note in the notes table. `id` is auto-incremented

#### Request

```
{"noteId": 9, "noteTitle": "New Note", "noteContent": "This is the content of the new note."}
```

#### Response

```
Notes Successfully Added
```

### API 3

#### Path: `/notes/:noteId/`

#### Method: `GET`

#### Description:

Returns a note based on the note ID

#### Response

```
{"noteId": 6, "noteTitle": "New Note", "noteContent": "This is the content of the new note."}

```

### API 4

#### Path: `/notes/:noteId/`

#### Method: `PUT`

#### Description:

Updates the details of a note in the Notes table based on the note ID

#### Request

```
{"noteTitle": "Updated Title", "noteContent": "Updated Content"}
```

#### Response

```
Note Details Updated

```

### API 5

#### Path: `/notes/:noteId/`

#### Method: `DELETE`

#### Description:

Deletes a note from the Notes table based on the note ID


#### Response

```
Note Removed
```
