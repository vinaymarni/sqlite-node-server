const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

const dbPath = path.join(__dirname, "mapdata.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/", async (request, response) => {
    const locationDetails = `
      SELECT
        *
      FROM
        MAPDATA
      ORDER BY
        id;`;
    const placesArray = await db.all(locationDetails);
    response.send(placesArray);
})



app.post("/", async (request, response) => {
    const locationDetails = request.body;
    const {id, place, lon, lat} = locationDetails;
    const addlacationQuery = `
        INSERT INTO
            MAPDATA (id, place, lon, lat)
        VALUES
            (
            ${id},
            '${place}',
            ${lon},
            '${lat}'
        );`;
    try{
        const dbResponse = await db.run(addlacationQuery);
        const id = dbResponse.lastID;
        response.send({ id: id });
        console.log("Posted successfully")
    }
    catch(err){
        response.send(err)
        console.error(err);   
    }
});



/*
app.get("/students/:studentId/", async (request, response) => {
    const { studentId } = request.params;
    const getStudentQuery = `
      SELECT
        *
      FROM
        STUDENTS
      WHERE
        id = ${studentId};`;
    const details = await db.get(getStudentQuery);
    response.send(details);   
  });


app.put("/students/:studentId/", async (request, response) => {
    const { studentId } = request.params;
    const studentDetails = request.body;
    const {name, rollNo, studentScore, gamesPlayed} = studentDetails;
    const updateStudentQuery = `
            UPDATE
                STUDENTS
            SET 
                studentName='${name}',
                rollNumber=${rollNo},
                score=${studentScore},
                games='${gamesPlayed}'
            WHERE
                id=${studentId};`;
    try{
        await db.run(updateStudentQuery);
        response.send("Student Details Updated Successfully");
    }
    catch(err){
        response.send(err)
        console.error(err);
    }
});


app.delete("/students/:studentId/", async (request, response) => {
  const { studentId } = request.params;
  const deleteStudentQuery = `
      DELETE FROM
        STUDENTS
      WHERE
        id = ${studentId};`;  
  try{
        
        await db.run(deleteStudentQuery);
        response.send("Student Deleted Successfully");
    }
    catch(err){
        response.send(err)
        console.error(err);
    }
});

  */

