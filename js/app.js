'use strict';

let ourFriendlyBeasts = [];

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
    }).then(renderAllBeasts)
}

const renderAllBeasts = () => {
  ourFriendlyBeasts.forEach((beast) => {
    console.log('am i getting to');
    beast.renderBeast();
  })
};

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


$(() => readJson());