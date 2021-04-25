window.addEventListener('DOMContentLoaded', start);

function start() {
  const inputs = document.querySelectorAll('.filters input');
  const outputs = document.querySelectorAll('output');
  const resetBtn = document.querySelector('.btn-reset');
  const nextBtn = document.querySelector('.btn-next');
  const loadBtn = document.querySelector('.btn-load--input');
  const saveBtn = document.querySelector('.btn-save');
  const fullScreenBtn = document.querySelector('.fullscreen');
  const canvas = document.querySelector('.canvas');

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

  function setFilterToCSS(filter, value, size) {
    const html = document.querySelector('html');

    html.style.setProperty(`--${filter}`, value + size);
  }

  function setFiltersToCanvas(filtersProto) {
    const filters = ['blur', 'invert', 'sepia', 'saturate', 'hue-rotate'];
    let filterStr = '';

    filters.forEach( filter => {
      let value;

      if (filter === 'hue-rotate') {
        value = window.getComputedStyle(filtersProto).getPropertyValue(`--hue`).replace(' ', '');
      } else if (filter === 'blur') {
        value = parseInt(window.getComputedStyle(filtersProto).getPropertyValue(`--blur`)) * 3 + 'px';
      } else {
        value = window.getComputedStyle(filtersProto).getPropertyValue(`--${filter}`).replace(' ', '');
      }
      filterStr += `${filter}(${value}) `;
    })

    return filterStr;
  }

  function setImgName(currentName, img) {
    const current = parseInt(currentName);

    if ( current + 1 > 20) {
      img.dataset.current = 1;
      return '01.jpg';
    } else {
      img.dataset.current = ((current + 1) < 10) ? `0${current + 1}` : `${current + 1}`;
      return ((current + 1) < 10) ? `0${current + 1}.jpg` : `${current + 1}.jpg`;
    }
  }

  function editLink(link, image) {
    const timeOfDay = getTimeOfDay(new Date());
    let splitedLink = link.split('/');
    const len = splitedLink.length;
    const parsedName = parseInt(splitedLink[len - 1]);
    let newLink = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/`;
    let newName = '';

    if (isNaN(parsedName) && !image.dataset.current) {
      newLink += '01.jpg';
      image.dataset.current = 1;
    } else if (isNaN(parsedName) && image.dataset.current) {
      newLink += setImgName(image.dataset.current, image);
    } else {
      newLink += setImgName(parsedName, image);
    }

    return newLink;
  }

  function saveImage() {
    const link = document.createElement('a');

    link.download = 'download.png';
    link.href = document.querySelector('.canvas').toDataURL();
    link.click();
    link.delete;
  }

  function setActiveBtnStatus(activeBtn) {
    const btns = document.querySelectorAll('.btn');

    btns.forEach( btn => btn.classList.remove('btn-active'));

    if (activeBtn.tagName === 'INPUT') {
      activeBtn.parentElement.classList.add('btn-active');
    } else {
      activeBtn.classList.add('btn-active');
    }
  }

  /* *** EVENTS' HANDLERS *** */
  function handleInput(event) {
    const target = event.target;

    setOutput(outputs, target);
    setFilterToCSS(target.name, target.value, target.dataset.sizing);
  }

  function handleReset(event) {
    setActiveBtnStatus(event.target);

    inputs.forEach( input => {
      if (input.classList.contains('filters__saturate')) {
        input.value = '100';
        setOutput(outputs, input);
      } else {
        input.value = '0';
        setOutput(outputs, input);
      }

      setFilterToCSS(input.name, input.value, input.dataset.sizing);
    });
  }

  function toggleNextImg(event) {
    const img = document.querySelector('.editor__img');
    const tempImg = new Image();
    const currentImgSrc = img.src;
    const newLink = editLink(currentImgSrc, img);

    setActiveBtnStatus(event.target);

    tempImg.src = newLink;
    tempImg.onload = () => {
      img.src = newLink;
    }
  }

  function loadImg(event) {
    const img = document.querySelector('.editor__img');
    const uploadedImg = event.target.files[0];
    const reader = new FileReader();

    setActiveBtnStatus(event.target);
    reader.addEventListener('loadend', (event) => {
      img.src = reader.result;
    });

    if (uploadedImg) {
      reader.readAsDataURL(uploadedImg);
      event.target.value = '';
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

  function handleClick(event) {
    setActiveBtnStatus(event.target);

    const img = new Image();
    const curImgSrc = document.querySelector('.editor__img').src;
    const appliedFilters = setFiltersToCanvas(document.querySelector('.editor__img'));

    img.setAttribute('crossOrigin', 'anonymous');
    img.src = curImgSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      ctx.filter = appliedFilters;
      ctx.drawImage(img, 0, 0);
      saveImage()
    };
  }
  /* *** *** *** */


  inputs.forEach( input => input.addEventListener('input', handleInput));
  resetBtn.addEventListener('click', handleReset);
  nextBtn.addEventListener('click', toggleNextImg);
  loadBtn.addEventListener('change', loadImg);
  saveBtn.addEventListener('click', handleClick);
  fullScreenBtn.addEventListener('click', toggleFullScreen);
}
