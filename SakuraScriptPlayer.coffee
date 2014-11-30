class SakuraScriptPlayer
  constructor: (@named)->
    @playing = false
    @breakTid = 0
    @timeCritical = false
    @wait_default = 80
    @timeout_default = 15000
    @choicetimeout_default = 30000

  play: (script, listener={})->
    if @playing and @timeCritical # called when time critical section
      @trigger_all 'reject', listener
      return
    @break()
    @playing = true
    @timeCritical = false

    splitargs = (str) ->
      str
      .replace /"((?:\\\\|\\"|[^"])*)"/g, (all, quoted) -> quoted.replace(/,/g,'\0')
      .split /\s*\,\s*/
      .map (arg) -> arg.replace /\0/g, ','
    tags = [
      {re: /^\\[h0]/, match: (group, state) -> @named.scope(0)}
      {re: /^\\[u1]/, match: (group, state) -> @named.scope(1)}
      {re: /^\\p\[(\d+)\]/, match: (group, state) -> @named.scope(Number group[1])}
      {re: /^\\p(\d)/, match: (group, state) -> @named.scope(Number group[1])}
      {re: /^\\s(\d)/, match: (group, state) -> @named.scope().surface(Number group[1])}
      {re: /^\\s\[([^\]]+)\]/, match: (group, state) -> @named.scope().surface(Number group[1])}
      {re: /^\\b(\d)/, match: (group, state) -> @named.scope().blimp(Number group[1])}
      {re: /^\\b\[([^\]]+)\]/, match: (group, state) -> @named.scope().blimp(Number group[1])}
      {re: /^\\i(\d)/, match: (group, state) -> @named.scope().surface().play(Number group[1])}
      {re: /^\\i\[(\d+)\]/, match: (group, state) -> @named.scope().surface().play(Number group[1])}
      {re: /^\\w(\d+)/, match: (group, state) -> state.wait = Number(group[1])*100}
      {re: /^\\\_w\[(\d+)\]/, match: (group, state) -> state.wait = Number(group[1])}
      {re: /^\\\_q/, match: (group, state) -> state.quick = !state.quick}
      {re: /^\\t/, match: (group, state) -> @timeCritical = true}
#      {re: /^\\x/, match: (group, state) -> }
      {re: /^\\\!\[\s*set\s*,\s*choicetimeout\s*,\s*(-?\d+)\s*\]/, match: (group, state) -> state.choicetimeout = Number group[1]}
      {re: /^\\\*/, match: (group, state) -> state.choicetimeout = -1}
      {re: /^\\q\[([^\]]+)\]/, match: (group, state) -> state.has_choice = true; blimp = @named.scope().blimp(); blimp.choice.apply(blimp, splitargs(group[1]))}
      {re: /^\\__q\[([^\]]+)\]/, match: (group, state) -> state.has_choice = true; blimp = @named.scope().blimp(); blimp.choiceBegin.apply(blimp, splitargs(group[1]))}
      {re: /^\\__q/, match: (group, state) -> @named.scope().blimp().choiceEnd()}
      {re: /^\\q\d+\[([^\]]+)\]\[([^\]]+)\]/, match: (group, state) -> state.has_choice = true; @named.scope().blimp().choice(group[2], group[1]); @named.scope().blimp().br()}
      {re: /^\\_a\[([^\]]+)\]/, match: (group, state) -> blimp = @named.scope().blimp(); blimp.anchorBegin.apply(blimp, splitargs(group[1]))}
      {re: /^\\_a/, match: (group, state) -> @named.scope().blimp().anchorEnd()}
      {re: /^\\n\[half\]/, match: (group, state) -> @named.scope().blimp().br()}
      {re: /^\\n/, match: (group, state) -> @named.scope().blimp().br()}
      {re: /^\\c/, match: (group, state) -> @named.scope().blimp().clear()}
      {re: /^\\[ez]/, match: (group, state) -> @playing = false; @named.scopes.forEach (scope) -> scope.surface().yenE()}
      {re: /^\\-/, match: (group, state) -> @playing = false; @named.scopes.forEach((scope) -> scope.surface().yenE()); @trigger_all('script:halt', listener)}
      {re: /^\\\\/, match: (group, state) -> @named.scope().blimp().talk("\\")}
      {re: /^\\\!\[\s*open\s*,\s*communicatebox\s*\]/, match: (group, state) -> setTimeout((=> @named.openCommunicateBox() ), 2000)}
      {re: /^\\\!\[\s*open\s*,\s*inputbox\s*,((?:\\\\|\\\]|[^\]])+)\]/, match: (group, state) -> setTimeout((=> @named.openInputBox(splitargs(group[1])[0]) ), 2000)}
      {re: /^\\\!\[\s*raise\s*,\s*((?:\\\\|\\\]|[^\]])+)\]/, match: (group, state) -> setTimeout((=> @trigger_all('script:raise', listener, splitargs(group[1])) ), 0)}
      {re: /^\\_u\[0x(\d+)\]/, match: (group, state) -> state.wait = @wait_default; @named.scope().blimp().talk('&#x'+group[1]+';')}
      {re: /^\\_m\[0x(\d+)\]/, match: (group, state) -> state.wait = @wait_default; @named.scope().blimp().talk('&#x'+group[1]+';')}
      {re: /^\\&\[([^\]]+)\]/, match: (group, state) -> state.wait = @wait_default; @named.scope().blimp().talk('&'+group[1]+';')}
      {re: /^\\[45Cx67+v8]/, match: (group, state) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^\\_[ns+V]/, match: (group, state) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^\\__[qtc]/, match: (group, state) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^\\[f8j]\[.*?\]/, match: (group, state) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^\\_[bl!?s]\[.*?\]/, match: (group, state) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^\\__[wq]\[.*?\]/, match: (group, state) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^\\!\[.*?\]/, match: (group, state) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^\\!_[v]\[.*?\]/, match: (group, state) -> @named.scope().blimp().talk(group[0])} # not implemented quick
      {re: /^./, match: (group, state) -> state.wait = @wait_default; @named.scope().blimp().talk(group[0])}
    ]

    state =
      quick: false
      has_choice: false

    do recur = =>
      if script.length is 0
        @playing = false
      if not @playing
        @trigger_all 'finish', listener
        if state.has_choice
          timeout = if state.choicetimeout? then state.choicetimeout else @choicetimeout_default
        else
          timeout = @timeout_default
        if timeout > 0
          @breakTid = setTimeout (=> @break()), timeout
        return
      state.wait = 0
      tag = tags.find (tag)-> tag.re.test(script)
      if tag?
        script = script.replace tag.re, (group..., offset, all) =>
          tag.match.call @, group, state # do func
          return '' # delete matched
      @breakTid = setTimeout recur, if state.quick then 0 else state.wait
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
