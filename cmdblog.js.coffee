root = exports ? this

root.cmdBlog = {}

root.cmdBlog._displayCache = {}

root.cmdBlog.displayTimerInterval = 10

root.cmdBlog._invalidCommandStr =
  """
  Invalid command.
  Type `help' for a list of available commands.
  """

root.cmdBlog.directories = {}

root.cmdBlog.directoryHandler = {}

root.cmdBlog.moveTo = (directory) ->
  errorStr =
    """
      No handler for this directory type.
    """
  if root.cmdBlog.directoryHandler[directory.type]
    root.cmdBlog.directoryHandler[directory.type](directory)
  else
    root.cmdBlog.displayResult errorStr
    
root.cmdBlog.commandFunctionList = {}

root.cmdBlog._displayNext = (objSelector, displayId) ->
  str = root.cmdBlog._displayCache[objSelector].str
  displayed = root.cmdBlog._displayCache[objSelector].displayed
  cntDisplayed = root.cmdBlog._displayCache[objSelector].cntDisplayed
  nowDisplayId = root.cmdBlog._displayCache[objSelector].displayId
  if nowDisplayId == displayId and cntDisplayed < str.length
    if str[cntDisplayed] == '{'
      ++cntDisplayed
      while str[cntDisplayed] != '}'
        displayed += str[cntDisplayed++]
    else
      displayed += str[cntDisplayed]
    this.html(displayed)
    root.cmdBlog._displayCache[objSelector].displayed = displayed
    root.cmdBlog._displayCache[objSelector].cntDisplayed = cntDisplayed + 1
    timerCmd = sprintf('$("%s").displayNext("%s", %d)', objSelector, objSelector, displayId)
    timer = setTimeout(timerCmd, root.cmdBlog.displayTimerInterval)
  return this

root.cmdBlog._display = (objSelector, str) ->
  if root.cmdBlog._displayCache[objSelector]
    ++root.cmdBlog._displayCache[objSelector].displayId
  else
    root.cmdBlog._displayCache[objSelector] = {}
    root.cmdBlog._displayCache[objSelector].displayId = 0
  root.cmdBlog._displayCache[objSelector].str = str
  root.cmdBlog._displayCache[objSelector].displayed = ""
  root.cmdBlog._displayCache[objSelector].cntDisplayed = 0
  this.displayNext objSelector, root.cmdBlog._displayCache[objSelector].displayId

root.cmdBlog.displayResult = (str) ->
  if not str
    str = "None"
  $(".result").display(".result",
    str.replace(/</g, '{&lt;}')\
    .replace(/>/g, '{&gt;}')\
    .replace(/\n/g, '{<br />}')
  )

root.cmdBlog.processCommand = (command) ->
  tokens = command.split ' '
  tokens = (token for token in tokens when token.length > 0)
  if root.cmdBlog.commandFunctionList[tokens[0]]
    root.cmdBlog.commandFunctionList[tokens[0]].run(tokens[1..tokens.length-1])
  else
    root.cmdBlog.displayResult root.cmdBlog._invalidCommandStr
