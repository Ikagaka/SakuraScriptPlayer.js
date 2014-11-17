// Generated by CoffeeScript 1.7.1
var SakuraScriptPlayer;

SakuraScriptPlayer = (function() {
  function SakuraScriptPlayer(named) {
    this.named = named;
  }

  SakuraScriptPlayer.prototype.play = function(script, callback) {
    var reg, wait, _script;
    if (callback == null) {
      callback = function() {};
    }
    if (script.length === 0) {
      return setTimeout(((function(_this) {
        return function() {
          return _this["break"]();
        };
      })(this)), 10000);
    }
    console.log(script);
    reg = {
      "Y0": /^\\0/,
      "Y1": /^\\1/,
      "Yp": /^\\p\[(\d+)\]/,
      "Ys": /^\\s\[([^\]]+)\]/,
      "Yb": /^\\b\[([^\]]+)\]/,
      "Yi": /^\\i\[(\d+)\]/,
      "YwN": /^\\w(\d+)/,
      "Y_w": /^\\_w\[(\d+)\]/,
      "Yq": /^\\q\[([^\]]+)\]/,
      "Y_aS": /^\\_a\[([^\]]+)\]/,
      "Y_aE": /^\\_a/,
      "Yc": /^\\c/,
      "Yn": /^\\n/,
      "YnH": /^\\n\[half\]/,
      "YY": /^\\\\/,
      "Ye": /^\\e/
    };
    switch (true) {
      case reg["Y0"].test(script):
        _script = script.replace(reg["Y0"], "");
        this.named.scope(0);
        break;
      case reg["Y1"].test(script):
        _script = script.replace(reg["Y1"], "");
        this.named.scope(1);
        break;
      case reg["Ys"].test(script):
        _script = script.replace(reg["Ys"], "");
        this.named.scope().surface(Number(reg["Ys"].exec(script)[1]));
        break;
      case reg["Yb"].test(script):
        _script = script.replace(reg["Yb"], "");
        this.named.scope().blimp(Number(reg["Yb"].exec(script)[1]));
        break;
      case reg["YwN"].test(script):
        _script = script.replace(reg["YwN"], "");
        wait = Number(reg["YwN"].exec(script)[1]) * 100;
        break;
      case reg["Y_w"].test(script):
        _script = script.replace(reg["Y_w"], "");
        wait = Number(reg["Y_w"].exec(script)[1]);
        break;
      case reg["YnH"].test(script):
        _script = script.replace(reg["YnH"], "");
        this.named.scope().blimp().br();
        break;
      case reg["Yn"].test(script):
        _script = script.replace(reg["Yn"], "");
        this.named.scope().blimp().br();
        break;
      case reg["Yc"].test(script):
        _script = script.replace(reg["Yc"], "");
        this.named.scope().blimp().clear();
        break;
      case reg["Ye"].test(script):
        _script = "";
        break;
      case reg["YY"].test(script):
        _script = script.replace(reg["YY"], "");
        this.named.scope().blimp().talk("\\");
        break;
      default:
        _script = script.slice(1);
        this.named.scope().blimp().talk(script[0]);
    }
    setTimeout(((function(_this) {
      return function() {
        return _this.play(_script, callback);
      };
    })(this)), 80);
    return void 0;
  };

  SakuraScriptPlayer.prototype["break"] = function() {
    this.named.scope(0).blimp(-1);
    return this.named.scope(1).blimp(-1);
  };

  return SakuraScriptPlayer;

})();
