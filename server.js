(function(log) {
  var WordNet = require('node-wordnet'),
      restify = require('restify'),
      server = restify.createServer();
  
  server.get('/:search', respond);
  server.listen(4000, function() {
    log(server.name, 'listening at', server.url);
  });
  
  function respond(request, response, next) {
    var wordnet = new WordNet();
    
    var width = 800,
        height = 800,
        word = request.params.search;

    var tree = [];

    wordnet.lookup(word, function(results) {
      if(!results.length)
        return next(new restify.InvaildArgumentError('\'' + word + '\' not found'));

      var branch,
          leaf,
          increment = 2 * Math.PI / results.length,
          radius = Math.max(width, height) / 3;

      results.forEach(function(result, i) {
        var angle = i * increment;

        branch = {
          word: result.lemma,
          glossary: result.gloss,
          type: result.pos,
          position: {
            x: Math.round(radius * Math.cos(angle)),
            y: Math.round(radius * Math.sin(angle))
          },
          children: []
        };

        if(result.synonyms.length > 1) {
          var child_increment = 2 * Math.PI / result.synonyms.length,
              child_radius = radius / 4;

          result.synonyms.forEach(function(synonym, j) {
            var angle = j * child_increment;

            leaf = {
              word: synonym,
              position: {
                x: branch.position.x + Math.round(child_radius * Math.cos(angle)),
                y: branch.position.y + Math.round(child_radius * Math.sin(angle))
              }
            };

            branch.children.push(leaf);
          });
        }

        tree.push(branch);
      });

      response.send(tree);
      next();
    });
  }
})(console.log);