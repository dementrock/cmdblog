displayCache = {}
timerInterval = 30

$ ()->
  jQuery.fn.displayNext = (objSelector, cntDisplayed) ->
    str = displayCache[objSelector].str
    displayed = displayCache[objSelector].displayed
    if cntDisplayed < str.length
      if str[cntDisplayed] == '{'
        ++cntDisplayed
        while str[cntDisplayed] != '}'
          displayed += str[cntDisplayed++]
      else
        displayed += str[cntDisplayed]
      this.html(displayed)
      displayCache[objSelector].displayed = displayed
      timerCmd = sprintf('$("%s").displayNext("%s", %d)', objSelector, objSelector, cntDisplayed + 1)
      timer = setTimeout(timerCmd, timerInterval)
    return this

  jQuery.fn.display = (objSelector, str) ->
    displayCache[objSelector] =
      str: str
      displayed: ''
    this.displayNext objSelector, 0
    
  (_init = () ->
    $(".cmdinput").focus()
    welcomeStr = """
    Welcome to Command-line Blog 0.1.{<br />}Copyright {&copy;} 2011 - DementRock.{<br />}Type "help" if first time.
    """
    $(".result").display(".result", welcomeStr))()

