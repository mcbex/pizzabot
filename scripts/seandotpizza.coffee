module.exports = (robot) ->

  robot.hear /\@seandotpizza:?\s?(.*)/i, (res) ->
    fact = res.match[1] && res.match[1].toUpperCase()
    knownFacts = robot.brain.get "facts"

    if knownFacts
      knownFacts = JSON.parse knownFacts 

      if (knownFacts.indexOf fact) != -1
        res.reply "YES, " + fact.toUpperCase()
        res.reply res.random knownFacts
      else
        knownFacts.push fact
        robot.brain.set "facts", JSON.stringify knownFacts
        res.reply "I DID NOT KNOW THAT"
    else
      knownFacts = [fact]
      robot.brain.set "facts", JSON.stringify knownFacts
      res.reply "I DID NOT KNOW THAT"

  robot.hear /.*/i, (res) ->
    chance = Math.random() * 100 < 10

    if chance
      knownFacts = robot.brain.get "facts"

      if knownFacts
        res.reply res.random knownFacts
      else
        res.reply "TELL ME SOMETHING ABOUT PIZZA"
