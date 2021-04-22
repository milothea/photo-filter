window.addEventListener('DOMContentLoaded', start);

function start() {
  const inputs = document.querySelectorAll('.filters input');
  const outputs = document.querySelectorAll('output');
  const resetBtn = document.querySelector('.btn-reset');
  const nextBtn = document.querySelector('.btn-next');
  const loadBtn = document.querySelector('.btn-load--input');
  const fullScreenBtn = document.querySelector('.fullscreen');

  /* COMMON METHODS */
  function getTimeOfDay(date) {
    const hours = date.getHours();

    if (0 <= hours && hours <= 5) {
      return 'night';
    } else if (6 <= hours && hours <= 11) {
      return 'morning';
    } else if ( 12 <= hours && hours <= 17) {
      return 'day';
    } else {
      return 'evening';
    }
  }

  function setOutput(outputArr, input) {
    outputArr.forEach( output => {
      if (output.classList.contains(input.classList[0])) {
        output.textContent = input.value;
      }
    });
  }

  function setFilter(filter, value, size) {
    const html = document.querySelector('html');

    html.style.setProperty(`--${filter}`, value + size);
  }

  function editLink(link) {
    const timeOfDay = getTimeOfDay(new Date());
    let splitedLink = link.split('/');
    const len = splitedLink.length;
    const parsedName = parseInt(splitedLink[len - 1]);
    let newLink = `https://github.com/rolling-scopes-school/stage1-tasks/tree/assets/images/${timeOfDay}/`;

    if (isNaN(parsedName)) {
      newLink += '01.jpg';
    } else {
      let newImgName = 0;

      if (parsedName > 20) {
        newImgName = 0;
      } else {
        newImgName = (parsedName < 10) ? `0${parsedName + 1}.img` : `${parsedName + 1}.img`;
      }

      newLink += newImgName;
    }

    return newLink;
  }

  /* *** EVENTS' HANDLERS *** */
  function handleInput(event) {
    const target = event.target;

    setOutput(outputs, target);
    setFilter(target.name, target.value, target.dataset.sizing);
  }

  function handleReset() {
    inputs.forEach( input => {
      if (input.classList.contains('filters__saturate')) {
        input.value = '100';
        setOutput(outputs, input);
      } else {
        input.value = '0';
        setOutput(outputs, input);
      }

      setFilter(input.name, input.value, input.dataset.sizing);
    })
  }

  function toggleNextImg(event) {
    const img = document.querySelector('.editor__img');
    const tempImg = new Image();
    const currentImgSrc = img.src;
    const newLink = editLink(currentImgSrc);

    tempImg.src = newLink;
    tempImg.onload = () => img.src;
  }

  function loadImg(event) {
    const img = document.querySelector('.editor__img');
    const uploadedImg = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('loadend', (event) => {
      img.src = reader.result;
    });

    if (uploadedImg) {
      reader.readAsDataURL(uploadedImg);
    }
  }

  function toggleFullScreen(event) {
    const target = event.currentTarget;
    const html = document.querySelector('html');

    if (target.classList.contains('openfullscreen')) {
      if (html.requestFullScreen) {
        html.requestFullScreen();
      } else if (html.mozRequestFullScreen) {
        html.mozRequestFullScreen();
      } else if (html.webkitRequestFullScreen) {
        html.webkitRequestFullScreen();
      }

      target.classList.remove('openfullscreen');
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }

      target.classList.add('openfullscreen');
    }
  }
  /* *** *** *** */


  inputs.forEach( input => input.addEventListener('input', handleInput));
  resetBtn.addEventListener('click', handleReset);
  nextBtn.addEventListener('click', toggleNextImg);
  loadBtn.addEventListener('change', loadImg);
  fullScreenBtn.addEventListener('click', toggleFullScreen);
}
