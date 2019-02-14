'use strict';

let ourFriendlyBeasts = [];
let keywords = [];

function HornMaker(beast) {
  this.image_url = beast.image_url;
  this.title = beast.title;
  this.description = beast.description;
  this.keyword = beast.keyword;
  this.horns = beast.horns;
  ourFriendlyBeasts.push(this);
}


const readJson = () => {
  $.get('data/page-1.json', 'json')
    .then((animals) => {
      animals.forEach((animal) => {
        new HornMaker(animal);
      })
    }).then(renderAllBeasts).then(getKeywords).then(hideEverything);
}

const renderAllBeasts = () => {
  ourFriendlyBeasts.forEach((beast) => {
    console.log('am i getting to');
    beast.renderBeast();
  })
}

const getKeywords = function() {
  for(let i = 0; i< ourFriendlyBeasts.length; i++) {
    if (keywords.indexOf(ourFriendlyBeasts[i].keyword) === -1){
      keywords.push(ourFriendlyBeasts[i].keyword);
    }
  }
  renderKeywords();
}

const renderKeywords = function() {
  keywords.forEach((word) => {
    $('#sort').append(`<option value="${word}">${word}</option>`)
  })
  $('#sort').append(`<option value="all">Show all</option>`)
}

HornMaker.prototype.renderBeast = function () {
  $('main').append('<div class="new-beast"></div>');
  let newBeast = $('.new-beast');
  newBeast.html($('#photo-template').html());

  newBeast.find('h2').text(this.title);
  newBeast.find('img').attr('src', this.image_url).attr('alt', ` picture of ${this.title}`);
  newBeast.find('p').text(this.description);
  newBeast.removeClass('new-beast');

  newBeast.addClass(this.keyword);
}

const hideEverything = () => {
  $('main > div').hide();
}

$('#sort').on('change', function()  {
  hideEverything();
  console.log($(this));
  let $selection = $('#sort').val();
  if($selection === 'all') {
    $('main > div').fadeIn(350);
    return;
  }
  $(`.${$selection}`).fadeIn(350);
})

$(() => readJson());