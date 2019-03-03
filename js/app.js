'use strict';

// constructor function, pulls all the data out of the .json-supplied objects
function HornMaker(rawData, whichDataSet) {
  for (let key in rawData) {
    this[key] = rawData[key];
  }
  this.whichDataSet = whichDataSet;

  if (whichDataSet === 'set-a') {
    HornMaker.ourFriendlyBeastsA.push(this);
  }
  if (whichDataSet === 'set-b') {
    HornMaker.ourFriendlyBeastsB.push(this);
  }
}

// sets up storage
HornMaker.ourFriendlyBeastsA = [];
HornMaker.ourFriendlyBeastsB = [];

HornMaker.keywordsA = [];
HornMaker.keywordsB = [];

// pulls data from .json, builds page with helper functions
const readJson = () => {
  $.get('data/page-1.json', 'json')
    .then((animals) => {
      animals.forEach((animal) => {
        new HornMaker(animal, 'set-a');
      })
    }).then(renderAllBeasts).then(getKeywords);
  $.get('data/page-2.json', 'json')
    .then((animals) => {
      animals.forEach((animal) => {
        new HornMaker(animal, 'set-b');
      })
    }).then(renderAllBeastsSetB).then(getKeywordsSetB).then($('main .set-b').hide());
}

// Renders set A
const renderAllBeasts = () => {
  HornMaker.ourFriendlyBeastsA.forEach((beast) => {
    beast.renderBeast();
  })
}

// Renders set B
const renderAllBeastsSetB = () => {
  HornMaker.ourFriendlyBeastsB.forEach((beast) => {
    beast.renderBeast();
  })
}

// Gathers up set a's keywords
const getKeywords = function () {
  for (let i = 0; i < HornMaker.ourFriendlyBeastsA.length; i++) {
    if (HornMaker.keywordsA.indexOf(HornMaker.ourFriendlyBeastsA[i].keyword) === -1) {
      HornMaker.keywordsA.push(HornMaker.ourFriendlyBeastsA[i].keyword);
    }
  }
  renderKeywords();
}

// Gathers up set b's keywords
const getKeywordsSetB = function () {
  for (let i = 0; i < HornMaker.ourFriendlyBeastsB.length; i++) {
    if (HornMaker.keywordsB.indexOf(HornMaker.ourFriendlyBeastsB[i].keyword) === -1) {
      HornMaker.keywordsB.push(HornMaker.ourFriendlyBeastsB[i].keyword);
    }
  }
  renderKeywordsSetB();
}

// Puts set a's keywords in the select dropdown
const renderKeywords = function () {
  HornMaker.keywordsA.forEach((word) => {
    $('select.set-a').append(`<option value="${word}">${word}</option>`)
  })
  $('select.set-a').append(`<option value="all">Show all</option>`)
}

// Puts set b's keywords in the select dropdown
const renderKeywordsSetB = function () {
  HornMaker.keywordsB.forEach((word) => {
    $('select.set-b').append(`<option value="${word}">${word}</option>`)
  })
  $('select.set-b').append(`<option value="all">Show all</option>`)
}

// Really just calls handlebars template
HornMaker.prototype.renderBeast = function () {
  $('main').append(this.buildTemplate());
}

// Handlebars template builder
HornMaker.prototype.buildTemplate = function () {
  const template = $('#beast-template').html();
  const compiled = Handlebars.compile(template);
  return compiled(this);
}

// compares values of appropriate type to sort images
const sortImages = (sortBy) => {
  if (sortBy === 'horns') {
    $('main > section').sort(function (a, b) { return $(a).attr('class').split(/\s/)[2] - $(b).attr('class').split(/\s/)[2] }).appendTo($('main'))
  }
  if (sortBy === 'name') {
    $('main > section').sort(function(a, b) {return $(a).children('h2').text().localeCompare($(b).children('h2').text())}).appendTo('main');
  }
}


// hide it all helper function
const hideEverything = () => {
  $('main > section').hide();
};

// Shows set a
$('select.set-a').on('change', function () {
  hideEverything();
  console.log($(this));
  let $selection = $('select.set-a').val();
  if ($selection === 'all') {
    $('main > .set-a').fadeIn(350);
    return;
  }
  $(`.${$selection}.set-a`).fadeIn(350);
})

// Shows set b
$('select.set-b').on('change', function () {
  hideEverything();
  console.log($(this));
  let $selection = $('select.set-b').val();
  if ($selection === 'all') {
    $('main .set-b').fadeIn(350);
    return;
  }
  $(`.${$selection}.set-b`).fadeIn(350);
})

// Sorting select event handler
$('.sortBy').on('change', function() {
  sortImages($('.sortBy').val());
})


$(() => {
  readJson();
  $('nav').on('click', 'li', function () {
    hideEverything();
    $('select').hide();
    $(`select.${$(this).attr('class')}`).fadeIn(300);
    $(`main > .${$(this).attr('class')}`).fadeIn(300);
  });
  $('select.set-b').hide();
  $('main').on('click', 'section', fullScreen)
});

const fullScreen = function () {

  $(this).toggleClass('full-screen');
}
