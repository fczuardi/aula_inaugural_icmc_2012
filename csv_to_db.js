var   csv = require('node-csv').createParser()
    , mongodb = require("mongodb");

var   students = {}
    , host = 'localhost'
    , port = mongodb.Connection.DEFAULT_PORT
    , server_options = null
    , name = 'aula'
    , db_options = null;

var   mongoserver = new mongodb.Server(host, port, server_options)
    , db_connector = new mongodb.Db(name, mongoserver, db_options);

function saveStudents(data, collection){
  data.forEach(function(row, index){
    if ((row[3].length == 0)||(index <= 2)){ return; }
    var student = {
      'name': row[4],
      'usp_number': row[3],
      'course_name': row[2],
      'course_code': row[1]
    }
    collection.update(
        {"usp_number": student.usp_number}
      , student
      , {"upsert": true}
    );
  });
  console.log(collection, 'foo');
  db_connector.close();
}

function parseCSV(collection){
  csv.parseFile('./ingressantes.csv', function(err, data) {
      saveStudents(data, collection);
  });
}

db_connector.open(function(err, db){
  if (err){ throw(err); }
  db.createCollection("alunos", function(err, collection){
      parseCSV(collection);
  });
});
