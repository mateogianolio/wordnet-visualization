(function(log) {
  var WordNet = require('node-wordnet'),
      wordnet = new WordNet();
  
  var width = 800,
      height = 800,
      word = process.argv[2] || '';
  
  var tree = [];

  wordnet.lookup(word, function(results) {
    if(!results.length) {
      log('\'' + word + '\' not found');
      return;
    }
    
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
      
      //log(result.synsetOffset);
      //log(result.pos);
      //log(result.lemma);
      //log(result.synonyms);
      //log(result.gloss);
    });
    
    log(JSON.stringify(tree, null, '  '));
  })
})(console.log);