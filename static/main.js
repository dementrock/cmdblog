(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.cmdBlog.directoryHandler.link = function(directory) {
    setTimeout(sprintf("window.location.href=\"%s\"", directory.url), 1000);
    return root.cmdBlog.displayResult("Entering " + directory.name + "...");
  };

  root.cmdBlog.directories.blog = {
    name: "blog",
    type: "link",
    url: "http://blog.rockyduan.com/"
  };

  root.cmdBlog.directories.github = {
    name: "cmbblog repository on github",
    type: "link",
    url: "https://github.com/dementrock/cmdblog"
  };

  root.cmdBlog.commandFunctionList.welcome = {
    run: function(args) {
      var welcomeStr;
      welcomeStr = "Welcome to Command-line Blog 0.1.\nCopyright {&copy;} 2011 - DementRock.";
      if (args.length === 0) {
        return welcomeStr;
      } else {
        return this.docString;
      }
    },
    docString: "Usage: welcome\nFunction: display welcome message.",
    hint: function() {
      return '';
    }
  };

  root.cmdBlog.commandFunctionList.help = {
    run: function(args) {
      var helpStr, noHelpStr;
      helpStr = "Available commands:\n%s\nType `help {&lt;}command{&gt;}' for usage of the specific command. ";
      noHelpStr = "Command not found.";
      if (args.length === 0) {
        return sprintf(helpStr, root.cmdBlog.listToString(root.cmdBlog.getCommandList()));
      } else if (args.length === 1) {
        if (root.cmdBlog.commandFunctionList[args[0]]) {
          return root.cmdBlog.commandFunctionList[args[0]].docString;
        } else {
          return noHelpStr;
        }
      } else {
        return this.docString;
      }
    },
    docString: "Usage 1: help\nFunction: display list of available commands.\nUsage 2: help {&lt;}command{&gt;}\nFunction: display usage of the command",
    hint: function(prefix) {
      return root.cmdBlog.getCommandList(prefix);
    }
  };

  root.cmdBlog.commandFunctionList.ls = {
    run: function(args) {
      if (args.length === 0) {
        return "Directories:\n\n" + root.cmdBlog.listToString(root.cmdBlog.getDirectoryList());
      } else {
        return this.docString;
      }
    },
    docString: "Usage: ls\nFunction: display directories under current path",
    hint: function() {
      return '';
    }
  };

  root.cmdBlog.commandFunctionList.cd = {
    run: function(args) {
      var directory, directoryNotFoundStr;
      directoryNotFoundStr = "Directory not found.";
      if (args.length !== 1) {
        return this.docString;
      } else {
        directory = args[0];
        if (directory[directory.length - 1] === '/') {
          directory = directory.slice(0, (directory.length - 2) + 1 || 9e9);
        }
        if (root.cmdBlog.directories[directory]) {
          return root.cmdBlog.moveTo(root.cmdBlog.directories[directory]);
        } else {
          return directoryNotFoundStr;
        }
      }
    },
    docString: "Usage: cd {&lt;}directory_name{&gt;}\nFunction: move to the directory."
  };

  root.cmdBlog.init = function() {
    return root.cmdBlog.processCommand("welcome");
  };

}).call(this);
