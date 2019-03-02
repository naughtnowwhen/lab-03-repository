'use strict';


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

HornMaker.ourFriendlyBeastsA = [];
HornMaker.ourFriendlyBeastsB = [];

HornMaker.keywordsA = [];
HornMaker.keywordsB = [];

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

const renderAllBeasts = () => {
  HornMaker.ourFriendlyBeastsA.forEach((beast) => {
    beast.renderBeast();
  })
}

const renderAllBeastsSetB = () => {
  HornMaker.ourFriendlyBeastsB.forEach((beast) => {
    beast.renderBeast();
  })
}

const getKeywords = function () {
  for (let i = 0; i < HornMaker.ourFriendlyBeastsA.length; i++) {
    if (HornMaker.keywordsA.indexOf(HornMaker.ourFriendlyBeastsA[i].keyword) === -1) {
      HornMaker.keywordsA.push(HornMaker.ourFriendlyBeastsA[i].keyword);
    }
  }
  renderKeywords();
}

const getKeywordsSetB = function () {
  for (let i = 0; i < HornMaker.ourFriendlyBeastsB.length; i++) {
    if (HornMaker.keywordsB.indexOf(HornMaker.ourFriendlyBeastsB[i].keyword) === -1) {
      HornMaker.keywordsB.push(HornMaker.ourFriendlyBeastsB[i].keyword);
    }
  }
  renderKeywordsSetB();
}

const renderKeywords = function () {
  HornMaker.keywordsA.forEach((word) => {
    $('select.set-a').append(`<option value="${word}">${word}</option>`)
  })
  $('select.set-a').append(`<option value="all">Show all</option>`)
}

const renderKeywordsSetB = function () {
  HornMaker.keywordsB.forEach((word) => {
    $('select.set-b').append(`<option value="${word}">${word}</option>`)
  })
  $('select.set-b').append(`<option value="all">Show all</option>`)
}


HornMaker.prototype.renderBeast = function () {
  $('main').append(this.buildTemplate());
}

HornMaker.prototype.buildTemplate = function () {
  const template = $('#beast-template').html();
  const compiled = Handlebars.compile(template);
  return compiled(this);
}

const hideEverything = () => {
  $('main > section').hide();
};


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
