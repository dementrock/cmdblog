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
    return root.cmdBlog.directoryHandler[directory.type](directory)
  else
    return errorStr
    
root.cmdBlog.commandFunctionList = {}

root.cmdBlog._handleTab = () ->
  inputVal = $(".cmdinput").val()
  tokens = root.cmdBlog.getTokens inputVal
  tabDisplay = (str) ->
    root.cmdBlog.displayResult 'Hint:\n\n' + str
  testMatch = (matchList, lastToken) ->
    if matchList.length == 1
      $(".cmdinput").val(inputVal + matchList[0][lastToken.length..matchList[0].length-1] + ' ')
      return true
    return false

  tabDisplay (() ->
    if tokens.length == 0
      return root.cmdBlog.listToString(root.cmdBlog.getCommandList())
    else
      if inputVal[inputVal.length - 1] == ' '
        if root.cmdBlog.commandFunctionList[tokens[0]]
          if root.cmdBlog.commandFunctionList[tokens[0]].hint
            matchList = root.cmdBlog.commandFunctionList[tokens[0]].hint()
            if not testMatch matchList, ''
              return root.cmdBlog.listToString root.cmdBlog.commandFunctionList[tokens[0]].hint()
          else
            matchList = root.cmdBlog.defaultHint()
            if not testMatch matchList, ''
              return root.cmdBlog.listToString root.cmdBlog.defaultHint()
      else
        if tokens.length == 1
          matchList = root.cmdBlog.getCommandList(tokens[0])
          if not testMatch matchList, tokens[0]
            return root.cmdBlog.listToString(root.cmdBlog.getCommandList(tokens[0]))
        else
          if root.cmdBlog.commandFunctionList[tokens[0]]
            if root.cmdBlog.commandFunctionList[tokens[0]].hint
              matchList = root.cmdBlog.commandFunctionList[tokens[0]].hint(tokens[tokens.length-1])
              if not testMatch matchList, tokens[tokens.length-1]
                return root.cmdBlog.listToString root.cmdBlog.commandFunctionList[tokens[0]].hint(tokens[tokens.length-1])
            else
              matchList = root.cmdBlog.defaultHint(tokens[tokens.length-1])
              if not testMatch matchList, tokens[tokens.length-1]
                return root.cmdBlog.listToString root.cmdBlog.defaultHint(tokens[tokens.length-1])
    return ''
  )()


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
  if root.cmdBlog._displayCache[objSelector] and str == root.cmdBlog._displayCache[objSelector].str
    return
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
    str.replace(/\n/g, '{<br />}')
  )


root.cmdBlog.listToString = (list) ->
  str = ""
  for element in list
    str += sprintf("{<span class='cmdblock'>%s</span>}", element)
  str

root.cmdBlog.defaultHint = (prefix) ->
  root.cmdBlog.getDirectoryList(prefix)

root.cmdBlog.getDirectoryList = (prefix) ->
  if prefix and prefix[prefix.length-1] == '/'
    prefix = prefix[0..prefix.length-2]
  (directory + '/' for directory, details of root.cmdBlog.directories when not prefix or prefix and directory[0..prefix.length-1] == prefix)

root.cmdBlog.getCommandList = (prefix) ->
  (command for command, detail of root.cmdBlog.commandFunctionList when not prefix or prefix and command[0..prefix.length - 1] == prefix)

root.cmdBlog.getTokens = (command) ->
  (token for token in command.split ' ' when token.length > 0)

root.cmdBlog.processCommand = (command) ->
  tokens = root.cmdBlog.getTokens command
  if root.cmdBlog.commandFunctionList[tokens[0]]
    root.cmdBlog.displayResult root.cmdBlog.commandFunctionList[tokens[0]].run(tokens[1..tokens.length-1])
  else
    root.cmdBlog.displayResult root.cmdBlog._invalidCommandStr

$ () ->

  jQuery.fn.displayNext = root.cmdBlog._displayNext
  jQuery.fn.display = root.cmdBlog._display

  $(".cmdinput").focus()

  $(".hiddentab").focus () ->
    root.cmdBlog._handleTab()
    $(".cmdinput").focus()

  $(window).click () ->
    $(".cmdinput").focus()

  $(document).keypress (e) ->
    if e.which == 13 and $(".cmdinput").is(":focus")
      root.cmdBlog.processCommand $(".cmdinput").val()
      $(".cmdinput").val("")

  root.cmdBlog.init()
