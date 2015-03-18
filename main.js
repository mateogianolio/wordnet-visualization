$(function() {
  var url = 'https://polar-coast-8848.herokuapp.com/',
      width = $('.container').width(),
      height = $('.container').height();

  var source = $('.source');
  source.css({
    left: (width / 2 - (source.width() / 2)),
    top: (height / 2 - (source.height() / 2))
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
        element;
    
    source.addClass('rotate');
    $.get(url + query, function(nodes) {
      setTimeout(function() { source.removeClass('rotate') }, 300);
      nodes.forEach(function(node, i) {
        element = document.createElement('span');
        $(element)
          .css({
            position: 'absolute',
            opacity: 0,
            transform: 'rotate(' + Math.atan(node.position.y / node.position.x) + 'rad)'
          })
          .addClass('node')
          .addClass(node.type)
          .addClass('' + i)
          .html(node.word.split('_').join(' '));

        $('.container').append(element);

        // grab element again when it has been given width
        element = $('.' + i);
        
        var center = {
          x: (width / 2 - element.width() / 2),
          y: (height / 2 - element.height() / 2)
        }, target = {
          x: !(i % 2) ? ((width / 1.5) * node.position.x) : (width * node.position.x),
          y: !(i % 2) ? ((height / 1.5) * node.position.y) : (height * node.position.y)
        };

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
          });
      });
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