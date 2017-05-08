(function (thumbcoil, thumbcoilUI){
  let sliceTypeTable = [
    'P',
    'B',
    'I',
    'SP',
    'SI'
  ];

  var getGopTable = function (parentEl) {
    let nals = Array.from(parentEl.querySelectorAll('mp4-box[data-type*=rbsp]'));
    let gopInfo = {};

    let frames = nals.reduce(function makeFrames(arr, box) {
      let frame = arr.pop();
      let type = box.getAttribute('data-type');

      if (type === 'access_unit_delimiter_rbsp') {
        if (frame) {
          arr.push(frame);
        }
        frame = {
          size: 0
        };
      } else if (type === 'slice_layer_without_partitioning_rbsp_idr') {
        frame.type = 'I';
        frame.isIDR = true;
      } else if (type === 'slice_layer_without_partitioning_rbsp') {
        frame.type = sliceTypeTable[Number(box.querySelector('mp4-properties>mp4-property>mp4-name[data-name=slice_type]').parentNode.querySelector('mp4-value').getAttribute('data-value')) % 5];
      }

      frame.size += Number(box.getAttribute('data-size'));

      arr.push(frame);
      return arr;
    }, []);

    let gops = frames.reduce(function makeGops(arr, frame){
      let gop = arr.pop();

      if (frame.isIDR) {
        if (gop) {
          arr.push(gop);
        }
        gop = {
          isComplete: true,
          frameCount: 0,
          frameTypeCount: {
            I: 0,
            B: 0,
            P: 0,
            SP: 0,
            SI: 0
          }
        };
      }

      if (!gop) {
        gop = {
          isComplete: false,
          frameCount: 0,
          frameTypeCount: {
            I: 0,
            B: 0,
            P: 0,
            SP: 0,
            SI: 0
          }
        };
      }
      gop.frameCount++;
      gop.frameTypeCount[frame.type]++;

      arr.push(gop);
      return arr;
    }, []);

    console.log(frames, gops);
   };
thumbcoilUI.addEventListener('done', getGopTable);
/*
  thumbcoilUI.addEventListener('done', function (parentEl) {
    let domDisplay = document.querySelector('#gop-display') || document.createElement('div');
    domDisplay.innerHTML = '';
    let gopTable = document.createElement('table');
    let gopRow = document.createElement('tr');
    let frameRow = document.createElement('tr');

    domDisplay.id = 'gop-display';
    gopTable.appendChild(frameRow);
    gopTable.appendChild(gopRow);
    domDisplay.appendChild(gopTable);

    // each AUD is starts a frame
    let AUD = parentEl.querySelectorAll('mp4-box[data-type^=access_unit]');
    let frameCount = AUD.length;
    let currentColumn = document.createElement('td');
    let currentColumnSize = 0;
    currentColumn.classList.add('jagged');

    AUD.forEach(function (audBox) {
      let sliceType = sliceTypeTable[Number(audBox.parentNode.querySelector('mp4-box[data-type^=slice]>mp4-properties>mp4-property>mp4-name[data-name=slice_type]').parentNode.querySelector('mp4-value').getAttribute('data-value')) % 5];
      let frameSize = Number(audBox.parentNode.parentNode.getAttribute('data-size'));
      let frameColumn = document.createElement('td');
      let frame = document.createElement('div');
      let frameSpan = document.createElement('span');
      frameSpan.style.bottom = '0px';
      frameSpan.style.position = 'absolute';
      frame.classList.add('frame-bar');
      frame.classList.add('frame-bar-' + sliceType);
      frame.style.height = (5 + frameSize / 1024) + 'px';
      frameColumn.style.verticalAlign = 'bottom';
      frame.appendChild(frameSpan);
      frameColumn.appendChild(frame);
      frameRow.appendChild(frameColumn);

      let isIDR = !!audBox.parentNode.querySelector('mp4-box[data-type^=slice_layer_without_partitioning_rbsp_idr]');
      if (isIDR) {
        if (currentColumnSize !== 0) {
          let columnDiv = document.createElement('div');
          columnDiv.innerText = currentColumnSize;
          columnDiv.classList.add('gop-bar');
          currentColumn.setAttribute('colspan', currentColumnSize);
          currentColumn.appendChild(columnDiv);
          gopRow.appendChild(currentColumn);
          currentColumn = document.createElement('td');
          currentColumnSize = 0;
        } else {
          currentColumn.classList.remove('jagged');
        }
      }
      currentColumnSize++;
    });
    let columnDiv = document.createElement('div');
    columnDiv.innerText = currentColumnSize;
    columnDiv.classList.add('gop-bar');
    currentColumn.setAttribute('colspan', currentColumnSize);
    currentColumn.appendChild(columnDiv);
    gopRow.appendChild(currentColumn);

    parentEl.parentNode.insertBefore(domDisplay, parentEl);
  });*/
})(window.thumbcoil,window.thumbcoilUI);
