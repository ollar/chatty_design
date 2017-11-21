;(function(window) {
  var body = document.body;
  var rhythm = parseInt(window.getComputedStyle(body)["line-height"]);
  var windowHeight = document.documentElement.scrollHeight;

  var rhythmHelper = document.createElement('div');
  rhythmHelper.className = 'rhythmHelper';
  rhythmHelper.style.position = 'absolute';

  rhythmHelper.style.top = 0;
  rhythmHelper.style.right = 0;
  rhythmHelper.style.bottom = 0;
  rhythmHelper.style.left = 0;

  rhythmHelper.style.backgroundImage = 'linear-gradient(#e3e 0, #e3e 1px, transparent 1px)';
  rhythmHelper.style.backgroundSize = '10px ' + rhythm + 'px';

  rhythmHelper.style.height = windowHeight + 'px';
  rhythmHelper.style.pointerEvents = 'none';

  document.body.appendChild(rhythmHelper)
})(window);
