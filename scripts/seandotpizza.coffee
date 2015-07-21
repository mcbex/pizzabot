timeToTalk = 0

canTalk = ->
  now = new Date().getTime()
  okToTalk = timeToTalk < now
  if okToTalk
    timeToTalk = 0
  okToTalk

module.exports = (robot) ->

  robot.hear /shuttup|shut\sup|shaddup|stfu/i, (res) ->
    if canTalk()
      timeToTalk = new Date().getTime() + (60 * 60 * 10000)
      res.reply "OK I'M SORRY!"

  robot.hear /\@seandotpizza:?\s?(.*)/i, (res) ->
    if canTalk()
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
    if canTalk()
        chance = Math.random() * 100 < 10

        if chance
          knownFacts = robot.brain.get "facts"

          if knownFacts
            knownFacts = JSON.parse knownFacts
            res.reply res.random knownFacts
          else
            res.reply "TELL ME SOMETHING ABOUT PIZZA"
