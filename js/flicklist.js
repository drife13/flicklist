var model = {
  watchlistItems: [],
  browseItems: []
}

var api = {
  root: "https://api.themoviedb.org/3",
  token: "6bc417d7c2dbb0e47a7aa89579192dce", // TODO 0 add your api key
  /**
   * Given a movie object, returns the url to its poster image
   */
  posterUrl: function(movie) {
    // TODO 4b
    // implement this function

    return "http://images5.fanpop.com/image/photos/25100000/movie-poster-rapunzel-and-eugene-25184488-300-450.jpg" 
  }
}

/**
 * Makes an AJAX request to themoviedb.org, asking for some movies
 * if successful, updates the model.browseItems appropriately, and then invokes
 * the callback function that was passed in
 */
function discoverMovies(callback) {
  $.ajax({
    url: api.root + "/discover/movie",
    data: {
      api_key: api.token
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
      console.log(response);
    }
  });
}

/**
 * Makes an AJAX request to the /search endpoint of the API, using the 
 * query string that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */
function searchMovies(query, callback) {
  $.ajax({
    url: api.root + "/search/movie",
    data: {
      api_key: api.token,
      query: query
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    }
  });
}

/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {

  // clear everything
  $("#section-watchlist ul").empty();
  $("#section-browse ul").empty();

  // insert watchlist items
  model.watchlistItems.forEach(function(movie) {
    var title = $("<h6/>").text(movie.original_title);

    var panelHeading = $("<div/>")
      .append(title)
      .attr("class panel-heading");

    // TODO 1 
    // add an "I watched it" button and append it below the title
    // Clicking should remove this movie from the watchlist and re-render
    var button = $("<button/>")
      .text("I watched it")
      .click(function() {
        model.watchlistItems.splice(
          model.watchlistItems.indexOf(movie),1
        );

        render();
    })
    
    // TODO 2i
    // apply the classes "btn btn-danger" to the "I watched it button"
    button.addClass("btn btn-danger");

    // TODO 4a
    // add a poster image and append it inside the 
    // panel body above the button
    var panelbody = $("<div/>")
      .append(button)
      .attr("class panel-body");

    // TODO 2g
    // re-implement the li as a bootstrap panel with a heading and a body
    var itemView = $("<li/>")
      .append(panelHeading)
      .append(panelBody)
      .attr("class", "item-watchlist panel panel-default");

    $("#section-watchlist ul").append(itemView);
  });

  // insert browse items
  model.browseItems.forEach(function(movie) {

    // TODO 2d continued (DONE)
    // style this list item to look like the demo
    // You'll also need to make changes in index.html.
    // use the following BS classes:
    // "list-group", "list-group-item", btn", "btn-primary", 
    
    var title = $("<h4/>").text(movie.original_title);

    var button = $("<button/>")
      .text("Add to Watchlist")
      .click(function() {
        model.watchlistItems.push(movie);
        render();
      })
      .prop("disabled", model.watchlistItems.indexOf(movie) !== -1)
      .attr("class", "btn btn-primary");

    var overview = $("<p/>").text(movie.overview);

    // append everything to itemView, along with an <hr/>
    var itemView = $("<li/>")
      .attr("class", "list-group-item")
      .append(title)
      .append(overview)
      .append(button);

      // append the itemView to the list
    $("#section-browse ul").append(itemView);
  });

}


// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function() {
  $("#form-search").submit(function(evt) {
    evt.preventDefault();
    var query = $("#form-search input[name=query]").val();
    searchMovies(query, render);
  });

  discoverMovies(render);
});