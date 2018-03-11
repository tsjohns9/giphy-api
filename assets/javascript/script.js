window.onload = function () {

  //Buttons will be created from the strings in this array. The strings will be gif topics used in the ajax request.
  var topicsArray = ['Anchorman', 'Star Wars', 'Spongebob', 'Step Brothers', 'Zoolander', 'Elf', 'Harry Potter', 'The Lord of The Rings', 'Dumb And Dumber', 'Wedding Crashers'];

  //used to track favorite giphs.
  var favUrls = [];

  //creates a button for each index in topicsArray to add to our button-container
  var createButtons = function () {
    topicsArray.map(a => $('.button-container').append(`<button type="button" class="btn btn-dark m-2 get-giphs">${a}</button>`));
  };

  //hides the div that contains our favorite giphs
  $('.all-favorites').hide();

  //function to remove giphs. Will be called each time a new giph button is pressed and when the favorite giph button is pressed
  var empty = function() {
    $('.display-giphs').empty();
    $('.display-giphs-2').empty();
  }

  //Sets up our url to pass into ajaxRequest(). the value of topic is passed in from the .get-giphs buttons
  var getGiphs = function (topic) {
    var url = 'https://api.giphy.com/v1/gifs/search?api_key=EU4CWjTbBYzh48LCPMWP7aXZBKdV2wAz';
    var q = '&q=' + topic;
    var limit = '&limit=24';
    var finalUrl = url + q + limit;
    ajaxRequest(finalUrl);
  };

  //makes ajax request based on the value of url, which is passed in from the getGiphs function
  var ajaxRequest = function (url) {
    //the API response is passed into displayGiphs to display our giphs to the page
    $.ajax({ url: url, method: 'GET' }).then( response => displayGiphs(response.data) );
  };

  //creates our html elements for each gif.
  var displayGiphs = function(data) {

    //data represents the giphs we receive from the received JSON object.Each item in data is a giph. Loops through data
    for (i = 0; i < data.length; i++) {

      //creates an image tag. attributes get added below
      var img = $(`<img class="card-img-top" src="" data-still="" data-animate="" data-state="still" style="height: 200px;">`);

      //card will get appended here. added col-md-4 since this will get appended to a bs row
      var newDiv = $('<div class="col-md-4"></div>');

      //creates bs card component. Img gets prepended here.
      //.fa-star is a star favicon. This is used to indicate a favorite giph. a favorite giph gets a class of orange-star
      var card = $(`
        <div class="card m-2"">
          <div class="card-body text-center">
            <p class="card-text">Rating: ${data[i].rating.toUpperCase()}</p>
            <i class="fa fa-star"></i>
          </div>
        </div>
      `);

      //sets the current image source as a still image. Sets a still and animated value to switch between on click.
      img.attr('src', data[i].images.fixed_height_still.url);
      img.attr('data-still', data[i].images.fixed_height_still.url);
      img.attr('data-animate', data[i].images.fixed_height.url);

      // checks if a giph has been favorited by seeing if the URL exists in the favUrls array. If the url is in here, then we add the orange-star class to .fa-star indicating it is has been favorited. This is needed because each time a button is clicked the previous giphs are removed. Each time a giph is rendered it checks if its url was previously marked as a favorite.
      if (favUrls.includes(data[i].images.fixed_height_still.url)) {
        card.find('.fa-star').addClass('orange-star')
      }

      //adds image to the card. adds card to the newDiv
      card.prepend(img);
      newDiv.append(card);

      //adds 12 images per page. Second page starts hidden
      if (i < 12) {
        $('.display-giphs').append(newDiv);
      } else {
        $('.display-giphs-2').append(newDiv);
      }

      //reveals next page button
      $('.page-nav').removeClass('d-none');
    }
  };

  //Made this a function since the first page needs to be revealed when page-2 is clicked, and when a new giph button is clicked.
  //reveals the first page
  var revealPage1 = function () {

    //reveals page 1. Hides page 2
    $('.display-giphs').removeClass('d-none');
    $('.display-giphs-2').addClass('d-none');

    //sets active button appearance
    $('.page-2').removeClass('active');
    $('.page-1').addClass('active');
  };

  //gets the user input to create a button that will generate giphs
  $('.btn-submit').click(function(e) {
    e.preventDefault();

    //gets the user input
    var topic = $("#search-field").val().trim();

    //checks if we have valid input. Does not create a new topic button if one already exists.
    if (topic && !topicsArray.includes(topic)) {

      //adds value to topicsArray, which stores all strings used for buttons
      topicsArray.push(topic);

      //removes and re-adds the current buttons on the screen on each submit to prevent duplicate buttons
      $('.button-container').empty();
      createButtons();
    }

    //removes our input from the screen
    $("#search-field").val('');
  });

  //attached to all giph buttons. Gets our giphs
  $(document).on('click', '.get-giphs', function () {

    //removes previous giphs
    empty();

    //hides our favorite giphs
    if ($('.all-favorites').is(':visible')) {
      $('.all-favorites').hide();
    }

    //checks if page-2 is active when a new button is pressed. reveals page-1 if it is.
    if ($('.page-2').hasClass('active')) {
      revealPage1();
    }

    //displays new giphs based on button text. getGiphs creates a URL for the ajaxRequest function, which then calls displayGiphs to generate our images.
    getGiphs($(this).text());
  });

  //switches between a still image and an animated image
  $(document).on('click', '.card-img-top', function () {

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
  $('.page-item').click(function () {

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

  //tracks favorite giphs
  $(document).on('click', '.fa-star', function () {

    //finds the still giph url for the parent of the .fa-star that was clicked
    var giphUrl = $(this).parents('.col-md-4').find('.card-img-top').attr('data-still');

    //used to shorten the search for the favorite giphs
    //finds the exact favorited giph URL on the passed in value, which is elem. giphUrl is the URL of the current favorite giph
    var findFavGiphUrl = function(elem) {
      return elem.find(`.card-img-top[data-still="${giphUrl}"]`).parents('.col-md-4')
    }

    //checks if a giph is favorite or not. orange-star indicates a favorite giph
    //If the giph is un-favorited, then the orange-star class is removed, and the giph is removed from .favorites
    if ($(this).hasClass('orange-star')) {
      $(this).removeClass('orange-star');

      //removes favorite giph from favUrls.This allows the giph to be re-added if it is favorited again.
      favUrls.splice(favUrls.indexOf(giphUrl),1)

      //removes giph from the .favorites div, which is revealed when the .favorites-btn is clicked
      findFavGiphUrl($('.favorites')).remove();

      if ($('.favorites').children().length < 2) {
        $('.favorites h3').removeClass('d-none');
      } 

      //runs if a giph is not selected as a favorite.
    } else {

      //indicates a favorite giph
      $(this).addClass('orange-star');

      //adds the favorite giph url to favUrls. Checks if it has already been added. Prevents duplicate giphs from being added
      if (!favUrls.includes(giphUrl)) {
        favUrls.push(giphUrl);

        //searches the .all-giphs div for a giph that matches the url of the current giph, and then clones and appends it
        findFavGiphUrl($('.all-giphs')).clone().appendTo('.favorites');

        //checks if a favorite giph has been added yet since the .favorites class says "No Favorite Giphs!" before a giph is added
        if ($('.favorites').children().length > 1) {
          $('.favorites h3').addClass('d-none');
        } 
      }
    }
  })

  //removes giphs, and shows favorites.
  $('.favorites-btn').click(function() {

    //.all-favorites is revealed when .favorites-btn is clicked. Is hidden when other giph buttons are clicked.
    if ($('.all-favorites').is(':hidden')) {

      //removes previous giphs
      empty();

      //reveals favorite giphs
      $('.all-favorites').show();
    }
  });

  //invokes our function to display the initial giph buttons
  createButtons();
}