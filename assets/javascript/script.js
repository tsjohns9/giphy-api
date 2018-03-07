window.onload = function () {

  //These words will be used to get giphs associated with them.
  var topicsArray = ['Darth Vader','Donald Trump','The Lord of The Rings'];

  //creates a button for each index in topicsArray
  var createButtons = function() {
    for (i = 0; i < topicsArray.length; i++) {
      var newButton = $(`<button type="button" class="btn btn-dark mr-2">${topicsArray[i]}</button>`);

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
}