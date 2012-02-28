var urllib = require('url');

//lynx installed on your machine is required
var   spawn = require('child_process').spawn
    , google_search_url = "http://www.google.com/search?q=";

function getGoogleResults(query) {
  var google_results = spawn('lynx', ['-dump', '-listonly', 
                              google_search_url + 
                              encodeURI('"'+query+'" -fuvest -"usp.br" -unicamp -ufscar -"yasni.com" -vestibular -"passei.com.br" -unesp -aprovados -chamada -"unesp.br"')]);
  google_results.query = query;
  google_results.stdout.on('data', function (data) {
    this.data += data;
  });     
  google_results.on('exit', function (code) {
    var   google_url_pattern = new RegExp("(^.*http\:\/\/www\.google\.com\/url\\?q\=)", 'gm')
        , url_pattern = new RegExp("^http[^\&]*", 'gm')
        , search_output = this.stdout.data.toString()
        , results = search_output.replace(google_url_pattern,'').match(url_pattern)
        , hosts_score = {};
    
    console.log("\n\n\n\n");
    console.log(this.query);
    results = results.map(function(url){
      // console.log(urllib.parse(url).hostname);
      hosts_score[urllib.parse(url).hostname] = hosts_score[urllib.parse(url).hostname] || 0;
      hosts_score[urllib.parse(url).hostname] ++;
      return unescape(url);
    })
    // console.log(hosts_score);
    console.log(results);
  });
  google_results.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    message.say('stderr: ' + data);
  });
}

// var query = process.argv[2];
// if(query.length > 2){
//   getGoogleResults(query);
// }

// var names = [
//     "Alan Nishimori Araujo"
//   , "Alisson Mateus de Oliveira Magalhaes"
//   , "Allan Zuffo"
//   , "Ana Paula Centanin Bertho"
//   , "Anaya Gimenes Ferreira"
//   , "Andre Badawi Missaglia"
//   , "Andre Escanuela Vaz"
//   , "Andre Franciscato Paggi"
//   , "Anna Paula Pawlicka Maule"
//   , "Antonio Carlos Moreira Lopes Junior"
//   , "Augusto Elias de Matos Lazaro"
// ]
// 
// names.forEach(getGoogleResults);