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
      return errorStr;
    }
  };

  root.cmdBlog.commandFunctionList = {};

  root.cmdBlog._handleTab = function() {
    var inputVal, tabDisplay, testMatch, tokens;
    inputVal = $(".cmdinput").val();
    tokens = root.cmdBlog.getTokens(inputVal);
    tabDisplay = function(str) {
      return root.cmdBlog.displayResult('Hint:\n\n' + str);
    };
    testMatch = function(matchList, lastToken) {
      if (matchList.length === 1) {
        $(".cmdinput").val(inputVal + matchList[0].slice(lastToken.length, (matchList[0].length - 1) + 1 || 9e9) + ' ');
        return true;
      }
      return false;
    };
    return tabDisplay((function() {
      var matchList;
      if (tokens.length === 0) {
        return root.cmdBlog.listToString(root.cmdBlog.getCommandList());
      } else {
        if (inputVal[inputVal.length - 1] === ' ') {
          if (root.cmdBlog.commandFunctionList[tokens[0]]) {
            if (root.cmdBlog.commandFunctionList[tokens[0]].hint) {
              matchList = root.cmdBlog.commandFunctionList[tokens[0]].hint();
              if (!testMatch(matchList, '')) {
                return root.cmdBlog.listToString(root.cmdBlog.commandFunctionList[tokens[0]].hint());
              }
            } else {
              matchList = root.cmdBlog.defaultHint();
              if (!testMatch(matchList, '')) {
                return root.cmdBlog.listToString(root.cmdBlog.defaultHint());
              }
            }
          }
        } else {
          if (tokens.length === 1) {
            matchList = root.cmdBlog.getCommandList(tokens[0]);
            if (!testMatch(matchList, tokens[0])) {
              return root.cmdBlog.listToString(root.cmdBlog.getCommandList(tokens[0]));
            }
          } else {
            if (root.cmdBlog.commandFunctionList[tokens[0]]) {
              if (root.cmdBlog.commandFunctionList[tokens[0]].hint) {
                matchList = root.cmdBlog.commandFunctionList[tokens[0]].hint(tokens[tokens.length - 1]);
                if (!testMatch(matchList, tokens[tokens.length - 1])) {
                  return root.cmdBlog.listToString(root.cmdBlog.commandFunctionList[tokens[0]].hint(tokens[tokens.length - 1]));
                }
              } else {
                matchList = root.cmdBlog.defaultHint(tokens[tokens.length - 1]);
                if (!testMatch(matchList, tokens[tokens.length - 1])) {
                  return root.cmdBlog.listToString(root.cmdBlog.defaultHint(tokens[tokens.length - 1]));
                }
              }
            }
          }
        }
      }
      return '';
    })());
  };

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
    if (root.cmdBlog._displayCache[objSelector] && str === root.cmdBlog._displayCache[objSelector].str) {
      return;
    }
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
    return $(".result").display(".result", str.replace(/\n/g, '{<br />}'));
  };

  root.cmdBlog.listToString = function(list) {
    var element, str, _i, _len;
    str = "";
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      element = list[_i];
      str += sprintf("{<span class='cmdblock'>%s</span>}", element);
    }
    return str;
  };

  root.cmdBlog.defaultHint = function(prefix) {
    return root.cmdBlog.getDirectoryList(prefix);
  };

  root.cmdBlog.getDirectoryList = function(prefix) {
    var details, directory, _ref, _results;
    if (prefix && prefix[prefix.length - 1] === '/') {
      prefix = prefix.slice(0, (prefix.length - 2) + 1 || 9e9);
    }
    _ref = root.cmdBlog.directories;
    _results = [];
    for (directory in _ref) {
      details = _ref[directory];
      if (!prefix || prefix && directory.slice(0, (prefix.length - 1) + 1 || 9e9) === prefix) {
        _results.push(directory + '/');
      }
    }
    return _results;
  };

  root.cmdBlog.getCommandList = function(prefix) {
    var command, detail, _ref, _results;
    _ref = root.cmdBlog.commandFunctionList;
    _results = [];
    for (command in _ref) {
      detail = _ref[command];
      if (!prefix || prefix && command.slice(0, (prefix.length - 1) + 1 || 9e9) === prefix) {
        _results.push(command);
      }
    }
    return _results;
  };

  root.cmdBlog.getTokens = function(command) {
    var token, _i, _len, _ref, _results;
    _ref = command.split(' ');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      token = _ref[_i];
      if (token.length > 0) _results.push(token);
    }
    return _results;
  };

  root.cmdBlog.processCommand = function(command) {
    var tokens;
    tokens = root.cmdBlog.getTokens(command);
    if (root.cmdBlog.commandFunctionList[tokens[0]]) {
      return root.cmdBlog.displayResult(root.cmdBlog.commandFunctionList[tokens[0]].run(tokens.slice(1, (tokens.length - 1) + 1 || 9e9)));
    } else {
      return root.cmdBlog.displayResult(root.cmdBlog._invalidCommandStr);
    }
  };

  $(function() {
    jQuery.fn.displayNext = root.cmdBlog._displayNext;
    jQuery.fn.display = root.cmdBlog._display;
    $(".cmdinput").focus();
    $(".hiddentab").focus(function() {
      root.cmdBlog._handleTab();
      return $(".cmdinput").focus();
    });
    $(window).click(function() {
      return $(".cmdinput").focus();
    });
    $(document).keypress(function(e) {
      if (e.which === 13 && $(".cmdinput").is(":focus")) {
        root.cmdBlog.processCommand($(".cmdinput").val());
        return $(".cmdinput").val("");
      }
    });
    return root.cmdBlog.init();
  });

}).call(this);
