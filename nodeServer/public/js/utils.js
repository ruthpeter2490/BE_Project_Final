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

