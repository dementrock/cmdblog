root = exports ? this

root.cmdBlog.directoryHandler.link = (directory) ->
  root.cmdBlog.displayResult "Entering " + directory.name + "..."
  setTimeout(sprintf("window.location.href=\"%s\"", directory.url), 1000)

root.cmdBlog.directories.blog =
  name: "blog"
  type: "link"
  url: "http://blog.rockyduan.com/"

root.cmdBlog.directories.github =
  name: "cmbblog repository on github"
  type: "link"
  url:  "https://github.com/dementrock/cmdblog"

root.cmdBlog.commandFunctionList.welcome =
  run: (args) ->
    welcomeStr =
      """
        Welcome to Command-line Blog 0.1.
        Copyright {&copy;} 2011 - DementRock.
      """
    if args.length == 0
      root.cmdBlog.displayResult welcomeStr
    else
      root.cmdBlog.displayResult this.docString
  docString: \
  """
    Usage: welcome
    Function: display welcome message.
  """
  hint: () ->
    ''

root.cmdBlog.commandFunctionList.help =
  run: (args) ->
    helpStr =
      """
        Available commands:
        %s
        Type `help {&lt;}command{&gt;}' for usage of the specific command. 
      """

    noHelpStr =
      """
        Command not found.
      """

    if args.length == 0
      root.cmdBlog.displayResult sprintf helpStr, root.cmdBlog.listToString(root.cmdBlog.getCommandList())
    else if args.length == 1
      if root.cmdBlog.commandFunctionList[args[0]]
        root.cmdBlog.displayResult root.cmdBlog.commandFunctionList[args[0]].docString
      else
        root.cmdBlog.displayResult noHelpStr
    else
      root.cmdBlog.displayResult this.docString

  docString: \
  """
    Usage 1: help
    Function: display list of available commands.
    Usage 2: help {&lt;}command{&gt;}
    Function: display usage of the command
  """

  hint: (prefix) ->
    root.cmdBlog.getCommandList(prefix)


root.cmdBlog.commandFunctionList.ls =
  run: (args) ->
    if args.length == 0
      root.cmdBlog.displayResult "Directories:\n\n" + root.cmdBlog.listToString(root.cmdBlog.getDirectoryList())
    else
      root.cmdBlog.displayResult this.docString
  docString: \
  """
    Usage: ls
    Function: display directories under current path
  """
  hint: () ->
    ''

root.cmdBlog.commandFunctionList.cd =
  run: (args) ->
    directoryNotFoundStr =
      """
        Directory not found.
      """
    if args.length != 1
      root.cmdBlog.displayResult this.docString
    else
      directory = args[0]
      if directory[directory.length-1] == '/'
        directory = directory[0..directory.length-2]
      if root.cmdBlog.directories[directory]
        root.cmdBlog.moveTo(root.cmdBlog.directories[directory])
      else
        root.cmdBlog.displayResult directoryNotFoundStr
  docString: \
  """
    Usage: cd {&lt;}directory_name{&gt;}
    Function: move to the directory.
  """

root.cmdBlog.init = () ->

  root.cmdBlog.processCommand "welcome"
