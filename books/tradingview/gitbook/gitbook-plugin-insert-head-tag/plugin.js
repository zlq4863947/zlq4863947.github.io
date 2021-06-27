require(['gitbook'], function(gitbook, $) {
  var insertTags = function() {
    tags.map(function(val) {

      if (val.indexOf('src') === -1 || val.indexOf('.src') !== -1 ) {
        document.body.insertAdjacentHTML('beforeend', val);
        return;
      }
      if (document.head.innerHTML.indexOf(val) === -1) {
        document.head.insertAdjacentHTML('beforeend', val)
      }
    })
  }

  gitbook.events.bind('start', function(e, config) {
    tags = config['insert-head-tag']['tags']
  })

  gitbook.events.bind('page.change', function() {
    insertTags()
  })
})
