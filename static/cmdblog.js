(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.cmdBlog = {};

  root.cmdBlog._displayCache = {};

  root.cmdBlog.displayTimerInterval = 10;

  root.cmdBlog._invalidCommandStr = "Invalid command.\nType `help' for a list of available commands.";

  root.cmdBlog.directories = {};

  root.cmdBlog.directoryHandler = {};

  root.cmdBlog.moveTo = function(directory) {
    var errorStr;
    errorStr = "No handler for this directory type.";
    if (root.cmdBlog.directoryHandler[directory.type]) {
      return root.cmdBlog.directoryHandler[directory.type](directory);
    } else {
      return root.cmdBlog.displayResult(errorStr);
    }
  };

  root.cmdBlog.commandFunctionList = {};

  root.cmdBlog._displayNext = function(objSelector, displayId) {
    var cntDisplayed, displayed, nowDisplayId, str, timer, timerCmd;
    str = root.cmdBlog._displayCache[objSelector].str;
    displayed = root.cmdBlog._displayCache[objSelector].displayed;
    cntDisplayed = root.cmdBlog._displayCache[objSelector].cntDisplayed;
    nowDisplayId = root.cmdBlog._displayCache[objSelector].displayId;
    if (nowDisplayId === displayId && cntDisplayed < str.length) {
      if (str[cntDisplayed] === '{') {
        ++cntDisplayed;
        while (str[cntDisplayed] !== '}') {
          displayed += str[cntDisplayed++];
        }
      } else {
        displayed += str[cntDisplayed];
      }
      this.html(displayed);
      root.cmdBlog._displayCache[objSelector].displayed = displayed;
      root.cmdBlog._displayCache[objSelector].cntDisplayed = cntDisplayed + 1;
      timerCmd = sprintf('$("%s").displayNext("%s", %d)', objSelector, objSelector, displayId);
      timer = setTimeout(timerCmd, root.cmdBlog.displayTimerInterval);
    }
    return this;
  };

  root.cmdBlog._display = function(objSelector, str) {
    if (root.cmdBlog._displayCache[objSelector]) {
      ++root.cmdBlog._displayCache[objSelector].displayId;
    } else {
      root.cmdBlog._displayCache[objSelector] = {};
      root.cmdBlog._displayCache[objSelector].displayId = 0;
    }
    root.cmdBlog._displayCache[objSelector].str = str;
    root.cmdBlog._displayCache[objSelector].displayed = "";
    root.cmdBlog._displayCache[objSelector].cntDisplayed = 0;
    return this.displayNext(objSelector, root.cmdBlog._displayCache[objSelector].displayId);
  };

  root.cmdBlog.displayResult = function(str) {
    if (!str) str = "None";
    return $(".result").display(".result", str.replace(/</g, '{&lt;}').replace(/>/g, '{&gt;}').replace(/\n/g, '{<br />}'));
  };

  root.cmdBlog.processCommand = function(command) {
    var token, tokens;
    tokens = command.split(' ');
    tokens = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        if (token.length > 0) _results.push(token);
      }
      return _results;
    })();
    if (root.cmdBlog.commandFunctionList[tokens[0]]) {
      return root.cmdBlog.commandFunctionList[tokens[0]].run(tokens.slice(1, (tokens.length - 1) + 1 || 9e9));
    } else {
      return root.cmdBlog.displayResult(root.cmdBlog._invalidCommandStr);
    }
  };

}).call(this);
