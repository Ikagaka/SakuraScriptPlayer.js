// Generated by CoffeeScript 1.8.0
(function() {
  var SakuraScriptPlayer,
    __slice = [].slice;

  SakuraScriptPlayer = (function() {
    function SakuraScriptPlayer(named) {
      this.named = named;
      this.playing = false;
      this.breakTid = 0;
      this.timeCritical = false;
      this.wait_default = 80;
      this.timeout_default = 15000;
      this.choicetimeout_default = 30000;
      this["continue"] = null;
      this.named.on("balloonclick", (function(_this) {
        return function(ev) {
          var fn;
          if (!!_this["continue"]) {
            fn = _this["continue"];
            _this["continue"] = null;
            return fn();
          }
        };
      })(this));
    }

    SakuraScriptPlayer.prototype.play = function(script, listener) {
      var recur, splitargs, state, tags;
      if (listener == null) {
        listener = {};
      }
      if (this.playing && this.timeCritical) {
        this.trigger_all('reject', listener);
        return;
      }
      this["break"]();
      this.playing = true;
      this.timeCritical = false;
      splitargs = function(str) {
        return str.replace(/"((?:\\\\|\\"|[^"])*)"/g, function(all, quoted) {
          return quoted.replace(/,/g, '\0');
        }).split(/\s*\,\s*/).map(function(arg) {
          return arg.replace(/\0/g, ',');
        });
      };
      tags = [
        {
          re: /^\\[h0]/,
          match: function(group, state) {
            return this.named.scope(0);
          }
        }, {
          re: /^\\[u1]/,
          match: function(group, state) {
            return this.named.scope(1);
          }
        }, {
          re: /^\\p\[(\d+)\]/,
          match: function(group, state) {
            return this.named.scope(Number(group[1]));
          }
        }, {
          re: /^\\p(\d)/,
          match: function(group, state) {
            return this.named.scope(Number(group[1]));
          }
        }, {
          re: /^\\s(\d)/,
          match: function(group, state) {
            return this.named.scope().surface(Number(group[1]));
          }
        }, {
          re: /^\\s\[([^\]]+)\]/,
          match: function(group, state) {
            return this.named.scope().surface(Number(group[1]));
          }
        }, {
          re: /^\\b(\d)/,
          match: function(group, state) {
            return this.named.scope().blimp(Number(group[1]));
          }
        }, {
          re: /^\\b\[([^\]]+)\]/,
          match: function(group, state) {
            return this.named.scope().blimp(Number(group[1]));
          }
        }, {
          re: /^\\i(\d)/,
          match: function(group, state) {
            return this.named.scope().surface().play(Number(group[1]));
          }
        }, {
          re: /^\\i\[(\d+)\]/,
          match: function(group, state) {
            return this.named.scope().surface().play(Number(group[1]));
          }
        }, {
          re: /^\\w(\d)/,
          match: function(group, state) {
            return state.wait = Number(group[1]) * 100;
          }
        }, {
          re: /^\\\_w\[(\d+)\]/,
          match: function(group, state) {
            return state.wait = Number(group[1]);
          }
        }, {
          re: /^\\\_q/,
          match: function(group, state) {
            return state.quick = !state.quick;
          }
        }, {
          re: /^\\\_s/,
          match: function(group, state) {
            return state.synchronized = state.synchronized ? false : [0, 1];
          }
        }, {
          re: /^\\\_s\[([^\]]+)\]/,
          match: function(group, state) {
            return state.synchronized = state.synchronized ? false : splitargs(group[1]).map(function(n) {
              return Number(n);
            });
          }
        }, {
          re: /^\\t/,
          match: function(group, state) {
            return this.timeCritical = true;
          }
        }, {
          re: /^\\x/,
          match: function(group, state) {
            state.click_wait = true;
            return this.named.scope(0).blimp().showWait();
          }
        }, {
          re: /^\\\!\[\s*set\s*,\s*choicetimeout\s*,\s*(-?\d+)\s*\]/,
          match: function(group, state) {
            return state.choicetimeout = Number(group[1]);
          }
        }, {
          re: /^\\\*/,
          match: function(group, state) {
            return state.choicetimeout = -1;
          }
        }, {
          re: /^\\q\[([^\]]+)\]/,
          match: function(group, state) {
            var blimp;
            state.has_choice = true;
            blimp = this.named.scope().blimp();
            return blimp.choice.apply(blimp, splitargs(group[1]));
          }
        }, {
          re: /^\\__q\[([^\]]+)\]/,
          match: function(group, state) {
            var blimp;
            state.has_choice = true;
            blimp = this.named.scope().blimp();
            return blimp.choiceBegin.apply(blimp, splitargs(group[1]));
          }
        }, {
          re: /^\\__q/,
          match: function(group, state) {
            return this.named.scope().blimp().choiceEnd();
          }
        }, {
          re: /^\\q(?:\d+)?\[([^\]]+)\]\[([^\]]+)\]/,
          match: function(group, state) {
            state.has_choice = true;
            this.named.scope().blimp().choice(group[2], group[1]);
            return this.named.scope().blimp().br();
          }
        }, {
          re: /^\\_a\[([^\]]+)\]/,
          match: function(group, state) {
            var blimp;
            blimp = this.named.scope().blimp();
            return blimp.anchorBegin.apply(blimp, splitargs(group[1]));
          }
        }, {
          re: /^\\_a/,
          match: function(group, state) {
            return this.named.scope().blimp().anchorEnd();
          }
        }, {
          re: /^\\n\[half\]/,
          match: function(group, state) {
            return this.named.scope().blimp().br();
          }
        }, {
          re: /^\\n/,
          match: function(group, state) {
            return this.named.scope().blimp().br();
          }
        }, {
          re: /^\\c/,
          match: function(group, state) {
            return this.named.scope().blimp().clear();
          }
        }, {
          re: /^\\[ez]/,
          match: function(group, state) {
            this.playing = false;
            return this.named.scopes.forEach(function(scope) {
              return scope.surface().yenE();
            });
          }
        }, {
          re: /^\\-/,
          match: function(group, state) {
            this.playing = false;
            this.named.scopes.forEach(function(scope) {
              return scope.surface().yenE();
            });
            return this.trigger_all('script:halt', listener);
          }
        }, {
          re: /^\\\\/,
          match: function(group, state) {
            return this.named.scope().blimp().talk("\\");
          }
        }, {
          re: /^\\\!\[\s*open\s*,\s*communicatebox\s*\]/,
          match: function(group, state) {
            return setTimeout(((function(_this) {
              return function() {
                return _this.named.openCommunicateBox();
              };
            })(this)), 2000);
          }
        }, {
          re: /^\\__c/,
          match: function(group, state) {
            return setTimeout(((function(_this) {
              return function() {
                return _this.named.openCommunicateBox();
              };
            })(this)), 2000);
          }
        }, {
          re: /^\\\!\[\s*open\s*,\s*inputbox\s*,((?:\\\\|\\\]|[^\]])+)\]/,
          match: function(group, state) {
            return setTimeout(((function(_this) {
              return function() {
                return _this.named.openInputBox(splitargs(group[1])[0]);
              };
            })(this)), 2000);
          }
        }, {
          re: /^\\\!\[\s*raise\s*,\s*((?:\\\\|\\\]|[^\]])+)\]/,
          match: function(group, state) {
            return setTimeout(((function(_this) {
              return function() {
                return _this.trigger_all('script:raise', listener, splitargs(group[1]));
              };
            })(this)), 0);
          }
        }, {
          re: /^\\_u\[0x(\d+)\]/,
          match: function(group, state) {
            state.wait = this.wait_default;
            return this.named.scope().blimp().talk('&#x' + group[1] + ';');
          }
        }, {
          re: /^\\_m\[0x(\d+)\]/,
          match: function(group, state) {
            state.wait = this.wait_default;
            return this.named.scope().blimp().talk('&#x' + group[1] + ';');
          }
        }, {
          re: /^\\&\[([^\]]+)\]/,
          match: function(group, state) {
            state.wait = this.wait_default;
            return this.named.scope().blimp().talk('&' + group[1] + ';');
          }
        }, {
          re: /^\\[45Cx67+v8]/,
          match: function(group, state) {
            return this.named.scope().blimp().talk(group[0]);
          }
        }, {
          re: /^\\_[ns+V]/,
          match: function(group, state) {
            return this.named.scope().blimp().talk(group[0]);
          }
        }, {
          re: /^\\__[qtc]/,
          match: function(group, state) {
            return this.named.scope().blimp().talk(group[0]);
          }
        }, {
          re: /^\\[f8j]\[.*?\]/,
          match: function(group, state) {
            return this.named.scope().blimp().talk(group[0]);
          }
        }, {
          re: /^\\_[bl!?s]\[.*?\]/,
          match: function(group, state) {
            return this.named.scope().blimp().talk(group[0]);
          }
        }, {
          re: /^\\__[wq]\[.*?\]/,
          match: function(group, state) {
            return this.named.scope().blimp().talk(group[0]);
          }
        }, {
          re: /^\\!\[.*?\]/,
          match: function(group, state) {
            return this.named.scope().blimp().talk(group[0]);
          }
        }, {
          re: /^\\!_[v]\[.*?\]/,
          match: function(group, state) {
            return this.named.scope().blimp().talk(group[0]);
          }
        }, {
          re: /^./,
          match: function(group, state) {
            state.wait = this.wait_default;
            if (!state.synchronized) {
              return this.named.scope().blimp().talk(group[0]);
            } else {
              return state.synchronized.forEach((function(_this) {
                return function(scopeid) {
                  var _ref;
                  return (_ref = _this.named.scopes[scopeid]) != null ? _ref.blimp().talk(group[0]) : void 0;
                };
              })(this));
            }
          }
        }
      ];
      state = {
        quick: false,
        synchronized: false,
        has_choice: false,
        click_wait: false
      };
      this.named.scopes.forEach(function(scope) {
        scope.blimp(0);
        return scope.blimp(-1);
      });
      (recur = (function(_this) {
        return function() {
          var tag, timeout;
          if (script.length === 0) {
            _this.playing = false;
          }
          if (!_this.playing) {
            _this.trigger_all('finish', listener);
            if (state.has_choice) {
              timeout = state.choicetimeout != null ? state.choicetimeout : _this.choicetimeout_default;
            } else {
              timeout = _this.timeout_default;
            }
            if (timeout > 0) {
              _this.breakTid = setTimeout((function() {
                return _this["break"]();
              }), timeout);
            }
            return;
          }
          state.wait = 0;
          tag = tags.find(function(tag) {
            return tag.re.test(script);
          });
          if (tag != null) {
            script = script.replace(tag.re, function() {
              var all, group, offset, _i;
              group = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), offset = arguments[_i++], all = arguments[_i++];
              tag.match.call(_this, group, state);
              return '';
            });
          }
          if (state.click_wait) {
            return _this["continue"] = function() {
              state.click_wait = false;
              return recur();
            };
          } else {
            return _this.breakTid = setTimeout(recur, state.quick ? 0 : state.wait);
          }
        };
      })(this))();
    };

    SakuraScriptPlayer.prototype["break"] = function() {
      this.playing = false;
      this.timeCritical = false;
      clearTimeout(this.breakTid);
      this.named.scopes.forEach(function(scope) {
        console.log(scope.blimp(-1));
        return scope.blimp(-1).clear();
      });
    };

    SakuraScriptPlayer.prototype.on = function(event, callback) {
      if (!((event != null) && (callback != null))) {
        throw Error('on() event and callback required');
      }
      if (this.listener == null) {
        this.listener = {};
      }
      if (this.listener[event] == null) {
        this.listener[event] = [];
      }
      if (-1 === this.listener[event].indexOf(callback)) {
        this.listener[event].push(callback);
      }
      return this;
    };

    SakuraScriptPlayer.prototype.off = function(event, callback) {
      var index;
      if ((event != null) && (callback != null)) {
        if (this.listener[event] != null) {
          index = this.listener[event].indexOf(callback);
          if (index !== -1) {
            this.listener[event].splice(index, 1);
          }
        }
      } else if (event != null) {
        delete this.listener[event];
      } else if (callback != null) {
        for (event in this.listener) {
          index = this.listener[event].indexOf(callback);
          if (index !== -1) {
            this.listener[event].splice(index, 1);
          }
        }
      } else {
        delete this.listener;
      }
      return this;
    };

    SakuraScriptPlayer.prototype.trigger = function() {
      var args, callback, event, _i, _len, _ref, _ref1;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (((_ref = this.listener) != null ? _ref[event] : void 0) != null) {
        _ref1 = this.listener[event];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          callback = _ref1[_i];
          setTimeout((function() {
            return callback.apply(this, args);
          }), 0);
        }
      }
      return this;
    };

    SakuraScriptPlayer.prototype.trigger_local = function() {
      var args, event, listener;
      event = arguments[0], listener = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if ((listener != null ? listener[event] : void 0) != null) {
        setTimeout((function() {
          return listener[event].apply(this, args);
        }), 0);
      }
      return this;
    };

    SakuraScriptPlayer.prototype.trigger_all = function() {
      var args, event, listener;
      event = arguments[0], listener = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      this.trigger_local.apply(this, [event, listener].concat(args));
      this.trigger.apply(this, [event].concat(args));
      return this;
    };

    return SakuraScriptPlayer;

  })();

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = SakuraScriptPlayer;
  } else if (this.Ikagaka != null) {
    this.Ikagaka.SakuraScriptPlayer = SakuraScriptPlayer;
  } else {
    this.SakuraScriptPlayer = SakuraScriptPlayer;
  }

}).call(this);
