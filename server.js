(function(log) {
  var WordNet = require('node-wordnet'),
      restify = require('restify'),
      server = restify.createServer();
  
  server.use(
    function crossOrigin(request, response, next) {
      response.header('Access-Control-Allow-Origin', '*');
      response.header('Access-Control-Allow-Headers', 'X-Requested-With');
      
      return next();
    }
  );
  server.get('/:search', respond);
  server.listen((process.env.PORT || 5000), function() {
    log(server.name, 'listening at', server.url);
  });
  
  function respond(request, response, next) {
    var wordnet = new WordNet(),
        word = request.params.search,
        tree = [];

    wordnet.lookup(word, function(results) {
      if(!results.length)
        return next(new restify.InvaildArgumentError('\'' + word + '\' not found'));

      var branch,
          increment = 2 * Math.PI / results.length,
          radius = 1 / 2;

      results.forEach(function(result, i) {
        var angle = i * increment;

        branch = {
          word: result.lemma,
          glossary: result.gloss,
          type: result.pos,
          position: {
            x: (radius * Math.cos(angle)),
            y: (radius * Math.sin(angle))
          },
          children: []
        };

        if(result.synonyms.length > 1)
          result.synonyms.forEach(function(synonym, j) {
            branch.children.push({
              word: synonym
            });
          });

        tree.push(branch);
      });

      response.send(tree);
      next();
    });
  }
})(console.log);