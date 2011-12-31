cmdBlog = {}

cmdBlog._displayCache = {}

cmdBlog._timerInterval = 10

cmdBlog._invalidCommandStr =
  """
  Invalid command.
  Type `help' for a list of available commands.
  """

cmdBlog.directories =
  blog:
    name: "blog"
    type: "link"
    url: "http://blog.rockyduan.com/"

cmdBlog.moveTo = (directory) ->
  if directory.type == "link"
    cmdBlog.displayResult "Entering " + directory.name + "..."
    setTimeout(sprintf("window.location.href=\"%s\"", directory.url), 1000)

cmdBlog.commandFunctionList =
  welcome:
    run: (args) ->
      welcomeStr =
        """
          Welcome to Command-line Blog 0.1.
          Copyright {&copy;} 2011 - DementRock.
        """
      if args.length == 0
        cmdBlog.displayResult welcomeStr
      else
        cmdBlog.displayResult this.docString
    docString: \
    """
      Usage: welcome
      Function: display welcome message.
    """
  help:
    run: (args) ->
      helpStr =
        """
          Available commands:
          %s
          Type `help <command>' for usage of the specific command. 
        """

      noHelpStr =
        """
          Command not found.
        """

      if args.length == 0
        cmdBlog.displayResult sprintf helpStr, cmdBlog._getCommandList()
      else if args.length == 1
        if cmdBlog.commandFunctionList[args[0]]
          cmdBlog.displayResult cmdBlog.commandFunctionList[args[0]].docString
        else
          cmdBlog.displayResult noHelpStr
      else
        cmdBlog.displayResult this.docString
    docString: \
    """
      Usage 1: help
      Function: display list of available commands.
      Usage 2: help <command>
      Function: display usage of the command
    """
  ls:
    run: (args) ->
      if args.length == 0
        cmdBlog.displayResult cmdBlog._getDirectoryList()
      else
        cmdBlog.displayResult this.docString
    docString: \
    """
      Usage: ls
      Function: display directories under current path
    """

  cd:
    run: (args) ->
      directoryNotFoundStr =
        """
          Directory not found.
        """
      if args.length != 1
        cmdBlog.displayResult this.docString
      else
        directory = args[0]
        if directory[directory.length-1] == '/'
          directory = directory[0..directory.length-2]
        if cmdBlog.directories[directory]
          cmdBlog.moveTo(cmdBlog.directories[directory])
        else
          cmdBlog.displayResult directoryNotFoundStr
    docString: \
    """
      Usage: cd <directory_name>
      Function: move to the directory.
    """

cmdBlog._getCommandList = () ->
  str = ""
  for command, detail of cmdBlog.commandFunctionList
    str += '`' + command + "', "
  str[0..str.length-3]

cmdBlog._getDirectoryList = () ->
  str = ""
  for directory, details of cmdBlog.directories
    str += directory + "/ "
  str[0..str.length-2]


cmdBlog._displayNext = (objSelector, displayId) ->
  str = cmdBlog._displayCache[objSelector].str
  displayed = cmdBlog._displayCache[objSelector].displayed
  cntDisplayed = cmdBlog._displayCache[objSelector].cntDisplayed
  nowDisplayId = cmdBlog._displayCache[objSelector].displayId
  if nowDisplayId == displayId and cntDisplayed < str.length
    if str[cntDisplayed] == '{'
      ++cntDisplayed
      while str[cntDisplayed] != '}'
        displayed += str[cntDisplayed++]
    else
      displayed += str[cntDisplayed]
    this.html(displayed)
    cmdBlog._displayCache[objSelector].displayed = displayed
    cmdBlog._displayCache[objSelector].cntDisplayed = cntDisplayed + 1
    timerCmd = sprintf('$("%s").displayNext("%s", %d)', objSelector, objSelector, displayId)
    timer = setTimeout(timerCmd, cmdBlog.timerInterval)
  return this

cmdBlog._display = (objSelector, str) ->
  if cmdBlog._displayCache[objSelector]
    ++cmdBlog._displayCache[objSelector].displayId
  else
    cmdBlog._displayCache[objSelector] = {}
    cmdBlog._displayCache[objSelector].displayId = 0
  cmdBlog._displayCache[objSelector].str = str
  cmdBlog._displayCache[objSelector].displayed = ""
  cmdBlog._displayCache[objSelector].cntDisplayed = 0
  this.displayNext objSelector, cmdBlog._displayCache[objSelector].displayId

cmdBlog.displayResult = (str) ->
  if not str
    str = "None"
  $(".result").display(".result",
    str.replace(/</g, '{&lt;}')\
    .replace(/>/g, '{&gt;}')\
    .replace(/\n/g, '{<br />}')
  )

cmdBlog.processCommand = (command) ->
  tokens = command.split ' '
  tokens = (token for token in tokens when token.length > 0)
  if cmdBlog.commandFunctionList[tokens[0]]
    cmdBlog.commandFunctionList[tokens[0]].run(tokens[1..tokens.length-1])
  else
    cmdBlog.displayResult cmdBlog._invalidCommandStr

$ () ->

  jQuery.fn.displayNext = cmdBlog._displayNext
  jQuery.fn.display = cmdBlog._display
  $(".cmdinput").focus()
  $(window).click ()->
    $(".cmdinput").focus()

  cmdBlog.processCommand "welcome"

  $(document).keypress (e) ->
    if e.which == 13 and $(".cmdinput").is(":focus")
      cmdBlog.processCommand $(".cmdinput").val()
      $(".cmdinput").val("")
