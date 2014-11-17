// Generated by CoffeeScript 1.7.1
var SakuraScriptPlayer;

SakuraScriptPlayer = (function() {
  function SakuraScriptPlayer(named) {
    this.named = named;
  }

  SakuraScriptPlayer.prototype.play = function(script, callback) {
    var recur;
    if (callback == null) {
      callback = function() {};
    }
    (recur = (function(_this) {
      return function() {
        var reg, wait, _script;
        if (script.length === 0) {
          return setTimeout((function() {
            return _this["break"]();
          }), 10000);
        }
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
            _this.named.scope(0).blimp(0);
            break;
          case reg["Y1"].test(script):
            _script = script.replace(reg["Y1"], "");
            _this.named.scope(1).blimp(0);
            break;
          case reg["Ys"].test(script):
            _script = script.replace(reg["Ys"], "");
            _this.named.scope().surface(Number(reg["Ys"].exec(script)[1]));
            break;
          case reg["Yb"].test(script):
            _script = script.replace(reg["Yb"], "");
            _this.named.scope().blimp(Number(reg["Yb"].exec(script)[1]));
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
            _this.named.scope().blimp().br();
            break;
          case reg["Yn"].test(script):
            _script = script.replace(reg["Yn"], "");
            _this.named.scope().blimp().br();
            break;
          case reg["Yc"].test(script):
            _script = script.replace(reg["Yc"], "");
            _this.named.scope().blimp().clear();
            break;
          case reg["Ye"].test(script):
            _script = "";
            break;
          case reg["YY"].test(script):
            _script = script.replace(reg["YY"], "");
            _this.named.scope().blimp().talk("\\");
            break;
          default:
            _script = script.slice(1);
            _this.named.scope().blimp().talk(script[0]);
        }
        script = _script;
        return setTimeout(recur, 80);
      };
    })(this))();
    return void 0;
  };

  SakuraScriptPlayer.prototype["break"] = function() {
    this.named.scope(0).blimp(-1);
    return this.named.scope(1).blimp(-1);
  };

  return SakuraScriptPlayer;

})();
