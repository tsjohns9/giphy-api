window.onload = function () {

  //Buttons will be created from the strings in this array. The strings will be gif topics used in the ajax request.
  var topicsArray = ['Dodgeball', 'Star Wars', 'Anchorman', 'Spongebob', 'Indiana Jones', 'Pulp Fiction', 'Step Brothers', 'Zoolander', 'The Matrix', 'Elf', 'The Dark Knight', 'Harry Potter', 'The Lord of The Rings', 'Dumb And Dumber', 'The Big Lebowski', 'Wedding Crashers'];

  //creates a button for each index in topicsArray to add to our button-container
  var createButtons = function () {
    topicsArray.map( a => $('.button-container').append(`<button type="button" class="btn btn-dark m-2 mr-2 get-giphs">${a}</button>`) );
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

      //passes our JSON response to displayGiphs to create HTML elements for each giph
      displayGiphs(response.data);
    })
  };

  //creates our html elements for each gif.
  var displayGiphs = function(data) {
    for (i = 0; i < data.length; i++) {
      var img = $(`<img class="card-img-top" src="" data-still="" data-animate="" data-state="still" style="height: 200px;">`);

      //card will get appended here. added col-md-4 since this will get appended to a bs row
      var newDiv = $('<div class="col-md-4"></div>');

      //creates bs card component. Img gets prepended here.
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

      //adds image to the card. adds card to the newDiv
      card.prepend(img);
      newDiv.append(card);

      //adds 12 images per page. Second page starts hidden
      i < 12 ? $('.display-giphs').append(newDiv) : $('.display-giphs-2').append(newDiv);

      //reveals next page button
      $('.page-nav').removeClass('d-none');
    }
  };

  //Made this a function since the first page needs to be revealed when page-2 is clicked, and when a new giph button is clicked.
  //reveals the first page
  var revealPage1 = function() {

      //reveals page 1. Hides page 2
      $('.display-giphs').removeClass('d-none');
      $('.display-giphs-2').addClass('d-none');

      //sets active button appearance
      $('.page-2').removeClass('active');
      $('.page-1').addClass('active');
  };

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

    //checks if page-2 is active when a new button is pressed. reveals page-1 if it is.
    if ($('.page-2').hasClass('active')) {
      revealPage1();
    }

    //displays new giphs based on button text
    getGiphs($(this).text());
  });

  //switches between a still image and an animated image
  $(document).on('click', '.card-img-top', function() {

    //data-state tells us the current state of the image. still or animated
    var state = $(this).attr('data-state')

    //switches between still and animated based on current state
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

    //checks what page is active. if the element has a class of page-1, then the second page is active.
    if ($(this).hasClass('page-1')) {

      //reveals page 1
      revealPage1();
    } else {

      //hides page 1. reveals page 2.
      $('.display-giphs').addClass('d-none');
      $('.display-giphs-2').removeClass('d-none');

      //sets active button appearance
      $('.page-1').removeClass('active');
      $(this).addClass('active');
    }
  });

  //invokes our function to display the initial giph buttons
  createButtons();
}