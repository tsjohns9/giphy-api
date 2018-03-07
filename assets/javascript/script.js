window.onload = function () {

  //EU4CWjTbBYzh48LCPMWP7aXZBKdV2wAz

  //data.rating
  //data.url 

  var getGiphs = function(topic) {
    var url = 'https://api.giphy.com/v1/gifs/search?api_key=EU4CWjTbBYzh48LCPMWP7aXZBKdV2wAz';
    var q = '&q=' + topic;
    var limit = '&limit=12';
    var finalUrl = url+q+limit;

    ajaxRequest(finalUrl)
  };

  //makes our ajax request based on the value of url.
  var ajaxRequest = function(url) {
    $.ajax({
      url: url,
      method: 'GET'
    }).then(function(response) {
      console.log(response.data)
      displayGiphs(response.data);
    })
  };

  var displayGiphs = function(data) {
    for (i = 0; i < data.length; i++) {
      var img = $(`<img class="card-img-top" src="" style="height: 200px;">`);
      var newDiv = $('<div class="col-md-4"></div>')
      var card = $(`
        <div class="card m-2"">
          <div class="card-body">
            <p class="card-text text-center">Rating: ${data[i].rating.toUpperCase()}</p>
          </div>
        </div>`
      );
      card.prepend(img);
      newDiv.append(card);
      img.attr('src', data[i].images.fixed_height_still.url);
      $('.display-giphs').append(newDiv)
    }
  };

  //These words will be used to get giphs associated with them.
  var topicsArray = ['Luke Skywalker','Donald Trump','The Lord of The Rings'];

  //creates a button for each index in topicsArray
  var createButtons = function() {
    for (i = 0; i < topicsArray.length; i++) {
      var newButton = $(`<button type="button" class="btn btn-dark mr-2 get-giphs">${topicsArray[i]}</button>`);

      //adds to the new btn to the .button-container
      $('.button-container').append(newButton);
    }
  }

  //invokes our function to display the initial giph buttons
  createButtons();

  $('.btn-submit').click(function(e) {
    //prevents submit button from refreshing the page
    e.preventDefault();
    
    //gets the value put into our input field
    var topic = $("#search-field").val().trim();

    //checks if we have valid input
    if (topic) {
      
      //adds that value to topicsArray
      topicsArray.push(topic);

      //removes our input from the screen
      $("#search-field").val('');

      //removes the current buttons on the screen
      $('.button-container').empty();

      //re-adds the buttons to the screen with the new button
      createButtons();
    }
  });


  $(document).on('click', '.get-giphs', function() {

    var btnValue = $(this).text();

    //removes giphs
    $('.display-giphs').empty();

    //displays new giphs based on button
    getGiphs(btnValue);
  });


}