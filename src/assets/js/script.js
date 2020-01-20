(function() {
  console.log('hohoho');

  console.log('jojo');

  /**
   * 間引き処理
   *
   * @param {*} func 間引きたい処理
   * @param {number} [wait=20] 間引きたい時間
   * @param {boolean} [immediate=true] wait経過後実行させない
   * @return
   */

  function debounce(func) {
    var _arguments = arguments,
      _this = this;

    var wait =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
    var immediate =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var timeout;
    return function() {
      var context = _this,
        args = _arguments;

      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
})();
