window.onload = function () {

  //Buttons will be created from the strings in this array. The strings will be gif topics used in the ajax request.
  var topicsArray = ['Dodgeball', 'Star Wars', 'Anchorman', 'Spongebob', 'Indiana Jones', 'Pulp Fiction', 'Step Brothers', 'Zoolander', 'The Matrix', 'Elf', 'The Dark Knight', 'Harry Potter', 'The Lord of The Rings', 'Dumb And Dumber', 'The Big Lebowski', 'Wedding Crashers'];

  //creates a button for each index in topicsArray
  var createButtons = function () {
    for (i = 0; i < topicsArray.length; i++) {
      var newButton = $(`<button type="button" class="btn btn-dark m-2 mr-2 get-giphs">${topicsArray[i]}</button>`);

      //adds to the new btn to the .button-container
      $('.button-container').append(newButton);
    }
  };

  //Sets up our url to pass into ajaxRequest()
  var getGiphs = function(topic) {
    var url = 'https://api.giphy.com/v1/gifs/search?api_key=EU4CWjTbBYzh48LCPMWP7aXZBKdV2wAz';
    var q = '&q=' + topic;
    var limit = '&limit=24';
    var finalUrl = url+q+limit;

    ajaxRequest(finalUrl);
  };

  //makes ajax request based on the value of url.
  var ajaxRequest = function(url) {
    console.log(url);
    $.ajax({
      url: url,
      method: 'GET'
    }).then(function(response) {
      console.log(response.data);

      //passes our JSON response to displayGiphs to create HTML elements to display them
      displayGiphs(response.data);
    })
  };

  //creates our html elements for each gif.
  var displayGiphs = function(data) {
    for (i = 0; i < data.length; i++) {
      var img = $(`<img class="card-img-top" src="" data-still="" data-animate="" data-state="still" style="height: 200px;">`);

      //card will get added appended here
      var newDiv = $('<div class="col-md-4"></div>');

      //creates bootstrap card component. Img gets prepended here.
      var card = $(`
        <div class="card m-2"">
          <div class="card-body">
            <p class="card-text text-center">Rating: ${data[i].rating.toUpperCase()}</p>
          </div>
        </div>
      `);

      //sets the current image source as a still image
      img.attr('src', data[i].images.fixed_height_still.url);

      //sets an attribute to contain the still and animated image.
      img.attr('data-still', data[i].images.fixed_height_still.url);
      img.attr('data-animate', data[i].images.fixed_height.url);

      //adds our image to the page
      card.prepend(img);
      newDiv.append(card);
      
      if (i < 12) {
        $('.display-giphs').append(newDiv);
      } else {
        $('.display-giphs-2').append(newDiv);
      }

      //reveals next page button
      $('.page-nav').removeClass('d-none');
    }
  };

  //invokes our function to display the initial giph buttons
  createButtons();

  $('.btn-submit').click(function(e) {
    e.preventDefault();
    
    //gets the value put into our input field
    var topic = $("#search-field").val().trim();

    //checks if we have valid input
    if (topic) {

      //adds that value to topicsArray
      topicsArray.push(topic);

      //removes our input from the screen
      $("#search-field").val('');

      //removes and re-adds the current buttons on the screen
      $('.button-container').empty();
      createButtons();
    }
  });

  //attached to all giph buttons. Gets our giphs
  $(document).on('click', '.get-giphs', function() {

    //removes giphs
    $('.display-giphs').empty();
    $('.display-giphs-2').empty();

    //displays new giphs based on button
    getGiphs($(this).text());
  });

  //switches between a still image and a animated image
  $(document).on('click', '.card-img-top', function() {

    //data-state tells us the current state of the image. still or animated
    var state = $(this).attr('data-state')

    if (state === 'still') {
      $(this).attr('data-state', 'animate');
      $(this).attr('src', $(this).attr('data-animate'));
    } else {
      $(this).attr('data-state', 'still');
      $(this).attr('src', $(this).attr('data-still'));
    }
  });

  //Switches between page 1 and 2 of the giphs.
  $('.page-item').click(function() {

    //checks what page we are on.
    //if the element has a class of page-1, then the second page is active.
    if ($(this).hasClass('page-1')) {

      //reveals page 1. Hides page 2
      $('.display-giphs').removeClass('d-none');
      $('.display-giphs-2').addClass('d-none');

      //sets active button appearance
      $('.page-2').removeClass('active');
      $(this).addClass('active');
    } else {

      //hides page 1. reveals page 2.
      $('.display-giphs').addClass('d-none');
      $('.display-giphs-2').removeClass('d-none');

      //sets active button appearance
      $('.page-1').removeClass('active');
      $(this).addClass('active');
    }
  });

}