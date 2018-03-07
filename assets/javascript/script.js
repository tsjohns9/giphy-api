window.onload = function () {

  //EU4CWjTbBYzh48LCPMWP7aXZBKdV2wAz

  //data.rating
  //data.url 

  var getGiphs = function(topic) {
    var url = 'https://api.giphy.com/v1/gifs/search?api_key=EU4CWjTbBYzh48LCPMWP7aXZBKdV2wAz';
    var q = '&q=' + topic;
    var limit = '&limit=10';
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
      var img = $('<img>');
      // var url = JSON.stringify(data[i].images.fixed_height_still.url);
      // console.log(url)
      img.attr('src', data[i].images.fixed_height_still.url);
      $('.display-giphs').append(img)
    }
  };

  //These words will be used to get giphs associated with them.
  var topicsArray = ['Darth Vader','Donald Trump','The Lord of The Rings'];

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

    //adds that value to topicsArray
    topicsArray.push(topic);

    //removes our input from the screen
    $("#search-field").val('');

    //removes the current buttons on the screen
    $('.button-container').empty();

    //re-adds the buttons to the screen with the new button
    createButtons();
  });


  $(document).on('click', '.get-giphs', function() {

    var btnValue = $(this).text();

    //removes giphs
    $('.display-giphs').empty();

    //displays new giphs based on button
    getGiphs(btnValue);
  });


}