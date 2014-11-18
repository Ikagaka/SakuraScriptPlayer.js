

class SakuraScriptPlayer
  constructor: (@named)->
    @playing = false
    @breakTid = 0

  play: (script, callback=->)->
    if @playing
      setTimeout -> callback(true)
      return

    @break()
    @playing = true

    script = "\\0\\s[0]\\b[0]\\1\\s[10]\\b[0]\\0" + script
    reg =
      "Y0": /^\\0/
      "Y1": /^\\1/
      "Yp": /^\\p\[(\d+)\]/
      "Ys": /^\\s\[([^\]]+)\]/
      "Yb": /^\\b\[([^\]]+)\]/
      "Yi": /^\\i\[(\d+)\]/
      "YwN": /^\\w(\d+)/
      "Y_w": /^\\_w\[(\d+)\]/
      "Yq": /^\\q\[([^\]]+)\]/
      "Y_aS": /^\\_a\[([^\]]+)\]/
      "Y_aE": /^\\_a/
      "Yc": /^\\c/
      "Yn": /^\\n/
      "YnH": /^\\n\[half\]/
      "YY": /^\\\\/
      "Ye": /^\\e/

    do recur = =>
      if script.length is 0
        @playing = false
        @breakTid = setTimeout((=> @break() ), 10000)
        return
      switch true
        when reg["Y0"].test(script)  then _script = script.replace(reg["Y0"],  ""); @named.scope(0).blimp(0)
        when reg["Y1"].test(script)  then _script = script.replace(reg["Y1"],  ""); @named.scope(1).blimp(0)
        #when reg["Yp"].test(script)  then _script = script.replace(reg["Yp"],  ""); @named.scope(Number(reg["Yp"].exec(script)[1]))
        when reg["Ys"].test(script)  then _script = script.replace(reg["Ys"],  ""); @named.scope().surface(Number(reg["Ys"].exec(script)[1]))
        when reg["Yb"].test(script)  then _script = script.replace(reg["Yb"],  ""); @named.scope().blimp(Number(reg["Yb"].exec(script)[1]))
        #when reg["Yi"].test(script)  then _script = script.replace(reg["Yi"],  ""); @named.scope().surface().playAnimation(Number(reg["Yi"].exec(script)[1]), ->)
        when reg["YwN"].test(script) then _script = script.replace(reg["YwN"], ""); wait = Number(reg["YwN"].exec(script)[1])*100
        when reg["Y_w"].test(script) then _script = script.replace(reg["Y_w"], ""); wait = Number(reg["Y_w"].exec(script)[1])
        #when reg["Yq"].test(script)  then _script = script.replace(reg["Yq"],  ""); [title, id] = reg["Yq"].exec(script)[1].split(",", 2); @named.scope().blimp().select(title, id)
        when reg["YnH"].test(script) then _script = script.replace(reg["YnH"], ""); @named.scope().blimp().br()
        when reg["Yn"].test(script)  then _script = script.replace(reg["Yn"],  ""); @named.scope().blimp().br()
        when reg["Yc"].test(script)  then _script = script.replace(reg["Yc"],  ""); @named.scope().blimp().clear()
        when reg["Ye"].test(script)  then _script = ""
        when reg["YY"].test(script)  then _script = script.replace(reg["YY"],  ""); @named.scope().blimp().talk("\\")
        else                              _script = script.slice(1);                @named.scope().blimp().talk(script[0])
      script = _script
      @breakTid = setTimeout(recur, 80)
    undefined

  break: ->
    @playing = false
    clearTimeout(@breakTid)
    @named.scopes.forEach (scope)->
      scope.blimp(-1).clear()
    undefined
