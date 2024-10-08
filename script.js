const playIcon = '&#9868;';
const pauseIcon = '&#10148;';
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const controlBtn = document.querySelector('.control-btn');
const downloadBtn = document.querySelector('.download-btn');
let interval = (currentImage = previousImage = null);
let currentState = 'play';
const images = [];
let speed = new URLSearchParams(window.location.search).get('speed') ?? 3;
speed *= 1000;
const body = document.body;
const bodyStyle = body.style;
bodyStyle.backgroundRepeat = 'no-repeat';
bodyStyle.backgroundSize = 'cover';
bodyStyle.backgroundPosition = 'center';
bodyStyle.backgroundAttachment = 'fixed';
let width = window.innerWidth;
let height = window.innerHeight;
const app = 'Images';
const VISITS_KEY = 'images-visits';

window.onresize = e => {
  width = window.innerWidth;
  height = window.innerHeight;
};

// trackVisitor();

async function loadImage() {
  if (currentState === 'play') {
    const response = await fetch(`https://picsum.photos/${width}/${height}`);
    blob = await response.blob();
    images.push(blob);
  } else {
    blob = images[currentImage];
  }
  if (
    currentState === 'play' ||
    (currentState === 'pause' && previousImage != currentImage)
  ) {
    previousImage = currentImage;
    bodyStyle.backgroundImage = `url('${URL.createObjectURL(blob)}')`;
  }
  imagesCount = images.length;
  console.table({ currentState, currentImage, imagesCount });
}
const download = e => {
  let imageIndex = (imageBlob = null);
  if (currentState === 'play') {
    imageIndex = images.length - 1;
  } else {
    imageIndex = currentImage ?? 0;
  }
  imageBlob = images[imageIndex];
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${new Date().getTime()}-${imageIndex}`;
  a.click();
  URL.revokeObjectURL(url);
};
const prev = e => {
  currentState = 'pause';
  controlBtn.innerHTML = pauseIcon;
  currentImage =
    currentImage === null ? images.length - 2 : currentImage - 1;
  if (currentImage === -1) {
    currentImage = images.length - 1;
  }
  clearInterval(interval);
  loadImage();
};
const control = e => {
  currentState = currentState === 'play' ? 'pause' : 'play';
  currentImage = null;
  if (currentState === 'play') {
    interval = setInterval(loadImage, speed);
    controlBtn.innerHTML = playIcon;
  } else {
    clearInterval(interval);
    controlBtn.innerHTML = pauseIcon;
  }
};
const next = e => {
  currentState = 'pause';
  controlBtn.innerHTML = pauseIcon;
  currentImage = currentImage === null ? 0 : currentImage + 1;
  if (currentImage === images.length) {
    currentImage = 0;
  }
  clearInterval(interval);
  loadImage();
};
downloadBtn.addEventListener('click', download);
prevBtn.addEventListener('click', prev);
controlBtn.addEventListener('click', control);
nextBtn.addEventListener('click', next);
interval = setInterval(loadImage, speed);
loadImage();
document.addEventListener('keydown', e => {
  switch (e.which) {
    case 32:
    case 38:
      control();
      break;
    case 40:
    case 68:
      download();
      break;
    case 37:
    case 80:
      prev();
      break;
    case 39:
    case 78:
      next();
      break;
  }
});