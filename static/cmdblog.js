(function() {
  var cmdBlog;

  cmdBlog = {};

  cmdBlog._displayCache = {};

  cmdBlog._timerInterval = 10;

  cmdBlog._invalidCommandStr = "Invalid command.\nType `help' for a list of available commands.";

  cmdBlog.directories = {
    blog: {
      name: "blog",
      type: "link",
      url: "http://blog.rockyduan.com/"
    }
  };

  cmdBlog.moveTo = function(directory) {
    if (directory.type === "link") {
      cmdBlog.displayResult("Entering " + directory.name + "...");
      return setTimeout(sprintf("window.location.href=\"%s\"", directory.url), 1000);
    }
  };

  cmdBlog.commandFunctionList = {
    welcome: {
      run: function(args) {
        var welcomeStr;
        welcomeStr = "Welcome to Command-line Blog 0.1.\nCopyright {&copy;} 2011 - DementRock.";
        if (args.length === 0) {
          return cmdBlog.displayResult(welcomeStr);
        } else {
          return cmdBlog.displayResult(this.docString);
        }
      },
      docString: "Usage: welcome\nFunction: display welcome message."
    },
    help: {
      run: function(args) {
        var helpStr, noHelpStr;
        helpStr = "Available commands:\n%s\nType `help <command>' for usage of the specific command. ";
        noHelpStr = "Command not found.";
        if (args.length === 0) {
          return cmdBlog.displayResult(sprintf(helpStr, cmdBlog._getCommandList()));
        } else if (args.length === 1) {
          if (cmdBlog.commandFunctionList[args[0]]) {
            return cmdBlog.displayResult(cmdBlog.commandFunctionList[args[0]].docString);
          } else {
            return cmdBlog.displayResult(noHelpStr);
          }
        } else {
          return cmdBlog.displayResult(this.docString);
        }
      },
      docString: "Usage 1: help\nFunction: display list of available commands.\nUsage 2: help <command>\nFunction: display usage of the command"
    },
    ls: {
      run: function(args) {
        if (args.length === 0) {
          return cmdBlog.displayResult(cmdBlog._getDirectoryList());
        } else {
          return cmdBlog.displayResult(this.docString);
        }
      },
      docString: "Usage: ls\nFunction: display directories under current path"
    },
    cd: {
      run: function(args) {
        var directory, directoryNotFoundStr;
        directoryNotFoundStr = "Directory not found.";
        if (args.length !== 1) {
          return cmdBlog.displayResult(this.docString);
        } else {
          directory = args[0];
          if (directory[directory.length - 1] === '/') {
            directory = directory.slice(0, (directory.length - 2) + 1 || 9e9);
          }
          if (cmdBlog.directories[directory]) {
            return cmdBlog.moveTo(cmdBlog.directories[directory]);
          } else {
            return cmdBlog.displayResult(directoryNotFoundStr);
          }
        }
      },
      docString: "Usage: cd <directory_name>\nFunction: move to the directory."
    }
  };

  cmdBlog._getCommandList = function() {
    var command, detail, str, _ref;
    str = "";
    _ref = cmdBlog.commandFunctionList;
    for (command in _ref) {
      detail = _ref[command];
      str += '`' + command + "', ";
    }
    return str.slice(0, (str.length - 3) + 1 || 9e9);
  };

  cmdBlog._getDirectoryList = function() {
    var details, directory, str, _ref;
    str = "";
    _ref = cmdBlog.directories;
    for (directory in _ref) {
      details = _ref[directory];
      str += directory + "/ ";
    }
    return str.slice(0, (str.length - 2) + 1 || 9e9);
  };

  cmdBlog._displayNext = function(objSelector, displayId) {
    var cntDisplayed, displayed, nowDisplayId, str, timer, timerCmd;
    str = cmdBlog._displayCache[objSelector].str;
    displayed = cmdBlog._displayCache[objSelector].displayed;
    cntDisplayed = cmdBlog._displayCache[objSelector].cntDisplayed;
    nowDisplayId = cmdBlog._displayCache[objSelector].displayId;
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
      cmdBlog._displayCache[objSelector].displayed = displayed;
      cmdBlog._displayCache[objSelector].cntDisplayed = cntDisplayed + 1;
      timerCmd = sprintf('$("%s").displayNext("%s", %d)', objSelector, objSelector, displayId);
      timer = setTimeout(timerCmd, cmdBlog.timerInterval);
    }
    return this;
  };

  cmdBlog._display = function(objSelector, str) {
    if (cmdBlog._displayCache[objSelector]) {
      ++cmdBlog._displayCache[objSelector].displayId;
    } else {
      cmdBlog._displayCache[objSelector] = {};
      cmdBlog._displayCache[objSelector].displayId = 0;
    }
    cmdBlog._displayCache[objSelector].str = str;
    cmdBlog._displayCache[objSelector].displayed = "";
    cmdBlog._displayCache[objSelector].cntDisplayed = 0;
    return this.displayNext(objSelector, cmdBlog._displayCache[objSelector].displayId);
  };

  cmdBlog.displayResult = function(str) {
    if (!str) str = "None";
    return $(".result").display(".result", str.replace(/</g, '{&lt;}').replace(/>/g, '{&gt;}').replace(/\n/g, '{<br />}'));
  };

  cmdBlog.processCommand = function(command) {
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
    if (cmdBlog.commandFunctionList[tokens[0]]) {
      return cmdBlog.commandFunctionList[tokens[0]].run(tokens.slice(1, (tokens.length - 1) + 1 || 9e9));
    } else {
      return cmdBlog.displayResult(cmdBlog._invalidCommandStr);
    }
  };

  $(function() {
    jQuery.fn.displayNext = cmdBlog._displayNext;
    jQuery.fn.display = cmdBlog._display;
    $(".cmdinput").focus();
    $(window).click(function() {
      return $(".cmdinput").focus();
    });
    cmdBlog.processCommand("welcome");
    return $(document).keypress(function(e) {
      if (e.which === 13 && $(".cmdinput").is(":focus")) {
        cmdBlog.processCommand($(".cmdinput").val());
        return $(".cmdinput").val("");
      }
    });
  });

}).call(this);
