$(function() {
  var url = 'https://polar-coast-8848.herokuapp.com/',
      width = $('.container').width(),
      height = $('.container').height();

  var source = $('.source');
  
  source.css({
    left: (width / 2) - (source.width() / 2),
    top: (height / 2) - (source.height() / 2)
  });

  source.keypress(keypress);
  
  function keypress(event) {
    // enter key
    if(event.which === 13)
      search($(this).val());
  }
  
  function search(query) {
    if(!query)
      return;
    
    clear();
    
    var source = $('.source'),
        element,
        word,
        glossary,
        angle;
    
    source.addClass('rotate');
    $.get(url + query, function(nodes) {
      setTimeout(function() { source.removeClass('rotate') }, 300);
      nodes.forEach(function(node, i) {
        element = document.createElement('div');
        
        word = node.word.split('_').join(' ');
        glossary = node.glossary
          .split(';') // text after ';' is example(s)
          .shift() // skip example (for now)
          .split(' ') // split into words
          .map(function(word, index) {
            return (!(index % 10) && index > 1) ? word + '<br>' : word;
          })
          .join(' ');
        angle = Math.atan(node.position.y / node.position.x);
        
        $(element)
          .css({
            position: 'absolute',
            opacity: 0,
            transform: 'rotate(' + angle + 'rad)'
          })
          .addClass('node')
          .addClass(node.type)
          .addClass('' + i)
          .append(
            $(document.createElement('div'))
              .html(word)
              .click(function() {
                var query = $(this).text();
                source.val(query);
                search(query);
            })
          );

        var gloss = document.createElement('div');
        
        $(gloss)
          .css('display', 'none')
          .addClass('glossary')
          .html(glossary);
        
        $(element).append(gloss);
        $('.container').append(element);
        
        // grab element again when it has been given width
        element = $('.' + i);
        gloss = element.find('.glossary');
        
        var center = {
          x: (width / 2 - element.width() / 2),
          y: (height / 2 - element.height() / 2)
        }, target = {
          x: !(i % 2) ? ((width / 1.4) * node.position.x) : ((width / 1.2) * node.position.x),
          y: !(i % 2) ? ((height / 1.4) * node.position.y) : ((height / 1.2) * node.position.y)
        };
        
        var leaf,
            j, y;
          
        // remove first synonym
        node.children.shift();
        
        for(j = 0; j < node.children.length; j++) {
          child = node.children[j];
          leaf = document.createElement('span');
          
          y = element.height() + 23 * j;
          
          $(leaf)
            .css({
              position: 'absolute',
              bottom: -y
            })
            .addClass('synonym')
            .addClass(node.type)
            .html(child.word.split('_').join(' '))
            .click(function() {
              var query = $(this).text();
              source.val(query);
              search(query);
            });
          
          $(gloss).append(leaf);
        }

        element
          .css({
            left: center.x,
            top: center.y
          })
          .animate({
            opacity: 1,
            left: '+=' + target.x,
            top: '+=' + target.y
          }, {
            duration: 500
          })
          .addClass(target.x > 0 ? 'right' : 'left');
      });
    }).fail(function() {
      source.removeClass('rotate');
    });
  }
  
  function clear() {
    $('.node').each(function() {
      var element = $(this);
      
      var center = {
        x: (width / 2 - element.width() / 2),
        y: (height / 2 - element.height() / 2)
      };
      
      element.animate({
        opacity: 0,
        left: center.x,
        top: center.y
      }, {
        duration: 300,
        complete: function() { $(this).remove() }
      });
    });
  }
});