'use strict';

let ourFriendlyBeastsA = [];
let ourFriendlyBeastsB = [];
let keywordsA = [];
let keywordsB = [];

function HornMaker(rawData, whichDataSet) {
  // this.image_url = beast.image_url;
  // this.title = beast.title;
  // this.description = beast.description;
  // this.keyword = beast.keyword;
  // this.horns = beast.horns;
  // this.whichDataSet = whichDataSet;
  for (let key in rawData) {
    this[key] = rawData[key];
  }
  this.whichDataSet = whichDataSet;

  if (whichDataSet === 'set-a') {
    ourFriendlyBeastsA.push(this);
  }
  if (whichDataSet === 'set-b') {
    ourFriendlyBeastsB.push(this);
  }
}


const readJson = () => {
  $.get('data/page-1.json', 'json')
    .then((animals) => {
      animals.forEach((animal) => {
        new HornMaker(animal, 'set-a');
      })
    }).then(renderAllBeasts).then(getKeywords).then(hideEverything);
  $.get('data/page-2.json', 'json')
    .then((animals) => {
      animals.forEach((animal) => {
        new HornMaker(animal, 'set-b');
      })
    }).then(renderAllBeastsSetB).then(getKeywordsSetB).then(hideEverything);
}

const renderAllBeasts = () => {
  ourFriendlyBeastsA.forEach((beast) => {
    beast.renderBeast();
  })
}

const renderAllBeastsSetB = () => {
  ourFriendlyBeastsB.forEach((beast) => {
    beast.renderBeast();
  })
}

const getKeywords = function () {
  for (let i = 0; i < ourFriendlyBeastsA.length; i++) {
    if (keywordsA.indexOf(ourFriendlyBeastsA[i].keyword) === -1) {
      keywordsA.push(ourFriendlyBeastsA[i].keyword);
    }
  }
  renderKeywords();
}

const getKeywordsSetB = function () {
  for (let i = 0; i < ourFriendlyBeastsB.length; i++) {
    if (keywordsB.indexOf(ourFriendlyBeastsB[i].keyword) === -1) {
      keywordsB.push(ourFriendlyBeastsB[i].keyword);
    }
  }
  renderKeywordsSetB();
}

const renderKeywords = function () {
  keywordsA.forEach((word) => {
    $('select.set-a').append(`<option value="${word}">${word}</option>`)
  })
  $('select.set-a').append(`<option value="all">Show all</option>`)
}

const renderKeywordsSetB = function () {
  keywordsB.forEach((word) => {
    $('select.set-b').append(`<option value="${word}">${word}</option>`)
  })
  $('select.set-b').append(`<option value="all">Show all</option>`)
}


HornMaker.prototype.renderBeast = function () {
  // $('main').append('<div class="new-beast"></div>');
  // let newBeast = $('.new-beast');
  // newBeast.html($('#photo-template').html());

  // newBeast.find('h2').text(this.title);
  // newBeast.find('img').attr('src', this.image_url).attr('alt', ` picture of ${this.title}`);
  // newBeast.find('p').text(this.description);
  // newBeast.removeClass('new-beast');

  // newBeast.addClass(this.keyword).addClass(this.whichDataSet);

  $('main').append(this.buildTemplate());
}

HornMaker.prototype.buildTemplate = function () {
  const template = $('#beast-template').html();
  const compiled = Handlebars.compile(template);
  return compiled(this);
}

// const beastTemplate = buildTemplate();

const hideEverything = () => {
  $('main > section').hide();
};


$('select.set-a').on('change', function () {
  hideEverything();
  console.log($(this));
  let $selection = $('select.set-a').val();
  if ($selection === 'all') {
    $('main > div.set-a').fadeIn(350);
    return;
  }
  $(`.${$selection}`).fadeIn(350);
})


$('select.set-b').on('change', function () {
  hideEverything();
  console.log($(this));
  let $selection = $('select.set-b').val();
  if ($selection === 'all') {
    $('main > div.set-b').fadeIn(350);
    return;
  }
  $(`.${$selection}`).fadeIn(350);
})


$(() => {
  readJson();
  $('nav').on('click', 'li', function () {
    hideEverything();
    // console.log();
    //great! Dana worked some magic
    $('select').hide();
    $(`select.${$(this).attr('class')}`).fadeIn(300);
  });
  $('select').hide();
  $('main').on('click', 'section', fullScreen)
});

const fullScreen = function() {

    $(this).toggleClass('full-screen');
  }