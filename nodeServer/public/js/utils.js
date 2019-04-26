let respondToVisibility = function(element, callback) {
  let options = {
    root: document.documentElement
  };
  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.intersectionRatio > 0){callback();}
    });
  }, options);
  (element instanceof jQuery) ?    observer.observe(element[0]):     observer.observe(element);
};

if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

// const slumsIcon = L.icon({iconUrl: 'icons/slumv2-round.png',iconSize: [32,32]});
const buildingIcon = L.icon({iconUrl: 'icons/home-round.png',iconSize: [32,32]});
const waterbodyIcon = L.icon({iconUrl: 'icons/waterbody-round.png',iconSize: [32,32]});
const forestryIcon = L.icon({iconUrl: 'icons/forestry-round.png',iconSize: [32,32]});

const ICONS = {
  // "slums": slumsIcon,
  "Buildings": buildingIcon,
  "Waterbody": waterbodyIcon,
  "Forestry": forestryIcon
};
