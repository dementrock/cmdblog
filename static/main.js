(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.cmdBlog.directoryHandler.link = function(directory) {
    root.cmdBlog.displayResult("Entering " + directory.name + "...");
    return setTimeout(sprintf("window.location.href=\"%s\"", directory.url), 1000);
  };

  root.cmdBlog.directories.blog = {
    name: "blog",
    type: "link",
    url: "http://blog.rockyduan.com/"
  };

  root.cmdBlog.directories.github = {
    github: {
      name: "cmbblog repository on github",
      type: "link",
      url: "https://github.com/dementrock/cmdblog"
    }
  };

  root.cmdBlog.commandFunctionList.welcome = {
    run: function(args) {
      var welcomeStr;
      welcomeStr = "Welcome to Command-line Blog 0.1.\nCopyright {&copy;} 2011 - DementRock.";
      if (args.length === 0) {
        return root.cmdBlog.displayResult(welcomeStr);
      } else {
        return root.cmdBlog.displayResult(this.docString);
      }
    },
    docString: "Usage: welcome\nFunction: display welcome message."
  };

  root.cmdBlog.commandFunctionList.help = {
    run: function(args) {
      var getCommandList, helpStr, noHelpStr;
      helpStr = "Available commands:\n%s\nType `help <command>' for usage of the specific command. ";
      noHelpStr = "Command not found.";
      getCommandList = function() {
        var command, detail, str, _ref;
        str = "";
        _ref = root.cmdBlog.commandFunctionList;
        for (command in _ref) {
          detail = _ref[command];
          str += '`' + command + "', ";
        }
        return str.slice(0, (str.length - 3) + 1 || 9e9);
      };
      if (args.length === 0) {
        return root.cmdBlog.displayResult(sprintf(helpStr, getCommandList()));
      } else if (args.length === 1) {
        if (root.cmdBlog.commandFunctionList[args[0]]) {
          return root.cmdBlog.displayResult(root.cmdBlog.commandFunctionList[args[0]].docString);
        } else {
          return root.cmdBlog.displayResult(noHelpStr);
        }
      } else {
        return root.cmdBlog.displayResult(this.docString);
      }
    },
    docString: "Usage 1: help\nFunction: display list of available commands.\nUsage 2: help <command>\nFunction: display usage of the command"
  };

  root.cmdBlog.commandFunctionList.ls = {
    run: function(args) {
      var getDirectoryList;
      getDirectoryList = function() {
        var details, directory, str, _ref;
        str = "";
        _ref = root.cmdBlog.directories;
        for (directory in _ref) {
          details = _ref[directory];
          str += directory + "/ \n";
        }
        return str.slice(0, (str.length - 2) + 1 || 9e9);
      };
      if (args.length === 0) {
        return root.cmdBlog.displayResult("Directories:\n\n" + getDirectoryList());
      } else {
        return root.cmdBlog.displayResult(this.docString);
      }
    },
    docString: "Usage: ls\nFunction: display directories under current path"
  };

  root.cmdBlog.commandFunctionList.cd = {
    run: function(args) {
      var directory, directoryNotFoundStr;
      directoryNotFoundStr = "Directory not found.";
      if (args.length !== 1) {
        return root.cmdBlog.displayResult(this.docString);
      } else {
        directory = args[0];
        if (directory[directory.length - 1] === '/') {
          directory = directory.slice(0, (directory.length - 2) + 1 || 9e9);
        }
        if (root.cmdBlog.directories[directory]) {
          return root.cmdBlog.moveTo(root.cmdBlog.directories[directory]);
        } else {
          return root.cmdBlog.displayResult(directoryNotFoundStr);
        }
      }
    },
    docString: "Usage: cd <directory_name>\nFunction: move to the directory."
  };

  root.cmdBlog.init = function() {
    jQuery.fn.displayNext = root.cmdBlog._displayNext;
    jQuery.fn.display = root.cmdBlog._display;
    $(".cmdinput").focus();
    $(window).click(function() {
      return $(".cmdinput").focus();
    });
    root.cmdBlog.processCommand("welcome");
    return $(document).keypress(function(e) {
      if (e.which === 13 && $(".cmdinput").is(":focus")) {
        root.cmdBlog.processCommand($(".cmdinput").val());
        return $(".cmdinput").val("");
      }
    });
  };

  $(function() {
    return root.cmdBlog.init();
  });

}).call(this);
