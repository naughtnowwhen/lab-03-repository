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
    })
}

$(() => readJson());




