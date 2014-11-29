class SakuraScriptPlayer
  constructor: (@named)->
    @playing = false
    @breakTid = 0
    @timeCritical = false

  play: (script, listener={})->
    if @playing and @timeCritical # called when time critical section
      @trigger_all 'reject', listener
      return
    @break()
    @playing = true
    @timeCritical = false
    @quick = false

    splitargs = (str) ->
      str
      .replace /"((?:\\\\|\\"|[^"])*)"/g, (all, quoted) -> quoted.replace(/,/g,'\0')
      .split /\s*\,\s*/
      .map (arg) -> arg.replace /\0/g, ','
    tags = [
      {re: /^\\[h0]/, match: (group) -> @named.scope(0).blimp(0)}
      {re: /^\\[u1]/, match: (group) -> @named.scope(1).blimp(0)}
      {re: /^\\p\[(\d+)\]/, match: (group) -> @named.scope(Number group[1])}
      {re: /^\\p(\d)/, match: (group) -> @named.scope(Number group[1])}
      {re: /^\\s(\d)/, match: (group) -> @named.scope().surface(Number group[1])}
      {re: /^\\s\[([^\]]+)\]/, match: (group) -> @named.scope().surface(Number group[1])}
      {re: /^\\b(\d)/, match: (group) -> @named.scope().blimp(Number group[1])}
      {re: /^\\b\[([^\]]+)\]/, match: (group) -> @named.scope().blimp(Number group[1])}
      {re: /^\\i(\d)/, match: (group) -> @named.scope().surface().play(Number group[1])}
      {re: /^\\i\[(\d+)\]/, match: (group) -> @named.scope().surface().play(Number group[1])}
      {re: /^\\w(\d+)/, match: (group) -> @wait = Number(group[1])*100}
      {re: /^\\\_w\[(\d+)\]/, match: (group) -> @wait = Number(group[1])}
      {re: /^\\\_q/, match: (group) -> @quick = !@quick}
      {re: /^\\t/, match: (group) -> @timeCritical = true}
#      {re: /^\\x/, match: (group) -> }
      {re: /^\\q\[([^\]]+)\]/, match: (group) -> [title, id] = group[1].split(",", 2); @named.scope().blimp().choice(title, id)}
      {re: /^\\_a\[([^\]]+)\]/, match: (group) -> @named.scope().blimp().anchorBegin(group[1])}
      {re: /^\\_a/, match: (group) -> @named.scope().blimp().anchorEnd()}
      {re: /^\\n\[half\]/, match: (group) -> @named.scope().blimp().br()}
      {re: /^\\n/, match: (group) -> @named.scope().blimp().br()}
      {re: /^\\c/, match: (group) -> @named.scope().blimp().clear()}
      {re: /^\\e/, match: (group) -> @playing = false; @named.scopes.forEach (scope) -> scope.surface().yenE()}
      {re: /^\\-/, match: (group) -> @playing = false; @named.scopes.forEach((scope) -> scope.surface().yenE()); @trigger_all('script:halt', listener)}
      {re: /^\\\\/, match: (group) -> @named.scope().blimp().talk("\\")}
      {re: /^\\\!\[\s*open\s*\,\s*communicatebox\s*\]/, match: (group) -> setTimeout((=> @named.openCommunicateBox() ), 2000)}
      {re: /^\\\!\[\s*open\s*\,\s*inputbox\s*\,((?:\\\\|\\\]|[^\]])+)\]/, match: (group) -> setTimeout((=> @named.openInputBox(splitargs(group[1])[0]) ), 2000)}
      {re: /^\\\!\[\s*raise\s*\,\s*((?:\\\\|\\\]|[^\]])+)\]/, match: (group) -> setTimeout((=> @trigger_all('script:raise', listener, splitargs(group[1])) ), 0)}
      {re: /^\\[45Cx67+v8]/, match: (group) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^\\!\[.*?\]/, match: (group) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^./, match: (group) -> @named.scope().blimp().talk(group[0])}
    ]

    do recur = =>
      if script.length is 0
        @playing = false
      if not @playing
        @trigger_all 'finish', listener
        @breakTid = setTimeout =>
          @trigger_all 'close', listener
          @break()
        , 10000
        return
      @wait = 80
      tag = tags.find (tag)-> tag.re.test(script)
      if tag?
        script = script.replace tag.re, (group..., offset, all) =>
          tag.match.call @, group # do func
          return '' # delete matched
      @breakTid = setTimeout recur, if @quick then 0 else @wait
    return

  break: ->
    @playing = false
    @timeCritical = false
    clearTimeout(@breakTid)
    @named.scopes.forEach (scope)->
      scope.blimp(-1).clear()
    return

  on: (event, callback) ->
    unless event? and callback? then throw Error 'on() event and callback required'
    unless @listener?
      @listener = {}
    unless @listener[event]?
      @listener[event] = []
    if -1 == @listener[event].indexOf(callback)
      @listener[event].push(callback)
    @

  off: (event, callback) -> # undefined means any
    if event? and callback?
      if @listener[event]?
        index = @listener[event].indexOf(callback)
        if index != -1
          @listener[event].splice(index, 1)
    else if event?
      delete @listener[event]
    else if callback?
      for event of @listener
        index = @listener[event].indexOf(callback)
        if index != -1
          @listener[event].splice(index, 1)
    else
      delete @listener
    @

  trigger: (event, args...) ->
    if @listener?[event]?
      for callback in @listener[event]
        setTimeout (-> callback.apply(@, args)), 0
    @

  trigger_local: (event, listener, args...) ->
    if listener?[event]?
      setTimeout (-> listener[event].apply(@, args)), 0
    @

  trigger_all: (event, listener, args...) ->
    @trigger_local.apply(@, [event, listener].concat(args))
    @trigger.apply(@, [event].concat(args))
    @

if module?.exports?
  module.exports = SakuraScriptPlayer
else if @Ikagaka?
  @Ikagaka.SakuraScriptPlayer = SakuraScriptPlayer
else
  @SakuraScriptPlayer = SakuraScriptPlayer
