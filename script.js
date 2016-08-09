function getCategoryProducts (categoryId, callback) {
  // create promises
  var categoriesPromise = $.getJSON('categories.json')
  var typesPromise = $.getJSON('types.json')
  var productsPromise = $.getJSON('products.json')
  //when you call getJSON with no callback it returns a promise

  // execute promises
  $.when(categoriesPromise, typesPromise, productsPromise).then(function (categoriesResponse, typesResponse, productsResponse) {
    //$.when = Promise.all in jquery
    var categories = categoriesResponse[0].categories
    var types = typesResponse[0].types
    var products = productsResponse[0].products
    // Find that category info
    var category
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id === categoryId) category = categories[i]
    }
      if (!category)
        return callback(new Error("Invalid category."))
    var categoryProducts = [] //set up array to match given type and category
    for (var i = 0; i < types.length; i++) {
      var type = types[i]

      // Skip loop iteration if category no match
      if (type.category !== category.id) continue // skip iteration of loop if cat. doesn't match type

      for (var j = 0; j < products.length; j++) {
        var product = products[j]
        // Skip if not matching type
        if (product.type !== type.id) continue // skip iteration of loop if type doesn't match product
        // Matching type, product - add result
        categoryProducts.push({
          category: category.name,
          type: type.name,
          name: product.name,
          description: product.description
        })
      }
    }
    callback(null, categoryProducts)
  }, function (err) {
    callback(err) // second callback, error callback
  })
}

$('#categoryId').on('change', function (evt) {
  $('#insertProducts').empty()
  var categoryId = parseInt(evt.target.value, 10) //html values are always strings, even if written without quotations
  if (isNaN(categoryId)) return
  getCategoryProducts(categoryId, function (err, products) { // err is null, callback(categoryProducts) begins
    if(err) return console.log(err)
    // insert products in dom
    for (var i = 0; i < products.length; i++) { // append to the dom
      var product = products[i]
      $('#insertProducts').append(`
        <div class="col-md-4">
          <p>${product.name}</p>
          <ul>
            <li>${product.category}</li>
            <li>${product.type}</li>
          </ul>
          <p>${product.description}</p>
          <hr />
        </div>
      `)
    }
  })
})
