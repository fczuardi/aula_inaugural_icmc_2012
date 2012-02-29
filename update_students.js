//lynx installed on your machine is required
var   query = {'name':/^z/i} //students with name starting in A
    , query_options = {'sort':'name'}
    , timer = 0
    , timer_increment = 2000
    , semaforo = 0;

var   mongodb = require("mongodb")
    , urllib = require('url')
    , spawn = require('child_process').spawn

var   db_host = 'localhost'
    , db_port = mongodb.Connection.DEFAULT_PORT
    , db_server_options = null
    , db_name = 'aula'
    , db_options = null;

var   mongoserver = new mongodb.Server(db_host, db_port, db_server_options)
    , db_connector = new mongodb.Db(db_name, mongoserver, db_options);

var   google_search_url = "http://www.google.com/search?q=";
var   duck_search_url = "http://www.duckduckgo.com?q=";

function getGoogleResults(item, collection) {

  // console.log(item);  
  // return false;
  
  var google_results = spawn('lynx', ['-dump', '-listonly', 
                              google_search_url + 
                              encodeURI('"'+item.name+'" -fuvest -"usp.br" -unicamp -ufscar -"yasni.com" -vestibular -"passei.com.br" -unesp -aprovados -chamada -"unesp.br"')]);
  google_results.item = item;
  google_results.collection = collection;
  google_results.stdout.on('data', function (data) {
    this.data += data;
  });     
  google_results.on('exit', function (code) {
    var   google_url_pattern = new RegExp("(^.*http\:\/\/www\.google\.com\/url\\?q\=)", 'gm')
        , url_pattern = new RegExp("^http[^\&]*", 'gm')
        , search_output = this.stdout.data.toString()
        , results = search_output.replace(google_url_pattern,'').match(url_pattern);
    
    console.log(this.item.name);

    if (!results) {
      console.log(search_output);
    }
    results = results.map(function(url){
      return unescape(url);
    })

    this.collection.update({'_id':this.item._id}, {$set:{'google_results_filtered':results}});
    console.log(this.item);
    console.log(results);
    setTimeout(function(){
      semaforo--;
      console.log('AAAA ',semaforo);
      if(semaforo==0){
        console.log('end');
        db_connector.close();
      }
    }, 4000);
  });
  google_results.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    message.say('stderr: ' + data);
  });
}

db_connector.open(function(err, db){
  if (err){ throw(err); }
  db.collection('alunos', function(err, collection){
    var stream = collection.find(query, query_options).streamRecords();
    // var stream = collection.find().streamRecords();
    stream.on("data", function(item) {
      semaforo++;
      // console.log(item);
      // console.log(collection);
      timer += timer_increment+Math.random()*timer_increment;
      setTimeout(function (){ getGoogleResults(item, collection) }, timer, item, collection);
      // setTimeout(function (){ getDuckResults(item, collection) }, timer, item, collection);
    });
    stream.on("end", function() {
      
    });
  });
});


