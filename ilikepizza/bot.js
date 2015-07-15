var _ = require('lodash'),
	SlackClient = require('slack-client'),
	slack = new SlackClient('xoxb-7686470962-P65S6qvEzlQNoHkrtD2TpkPn', true, true);

var quotes = require('./pizzafacts.json'),
	subscribers = {};

function pizzaFact () {
	return [
       	quotes.pizza,
       	quotes.tagline,
       	quotes.pizza,
    	_.sample(quotes.facts)
    ].join(' ');
}

function subscribe (user, channel) {
	var MAX_FACTS = subscribers[user.name] = 5,
		SLEEP_TIME = 1000 * 60;

	var id = setInterval(function () {
		if (subscribers[user.name]-- === 0) {
			delete subscribers[user.name];
			clearInterval(id);
		} else {
			channel.send(
				'@' + user.name 
				+ ' [' +  (MAX_FACTS - subscribers[user.name]) + '/' + MAX_FACTS + '] ' 
				+ pizzaFact()
			);
		}
	}, SLEEP_TIME);
}

function matches (message, word) {
	return !!~message.text.toLowerCase().indexOf(word);
}

function makeResponseMaybe (message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel),
        user = slack.getUserByID(message.user);

    // something is wrong, bail out
    if (!message || !channel || !user || user.is_bot) return;
    
    // offer pizza fact
    if (matches(message, 'pizza')) channel.send(pizzaFact());

    // user wants to subscribe
    if (matches(message, 'unsubscribe')) {
    	channel.send([
    		quotes.pizza + ' THANK YOU FOR UNSUBSCRIBING!',
    		'YOU WILL NOW RECEIVE PIZZA UPDATES FOR SEVERAL MINUTES. ' + quotes.pizza
    	].join('\n'));

    	// lol
    	!subscribers[user.name] && subscribe(user, channel);
    }
}

slack.on('message', function (message) {
    // console.log('[message]', message.text);
    makeResponseMaybe(message);
});

slack.on('open', console.error.bind(console, '[open]'));
slack.on('error', console.error.bind(console, '[error]'));

slack.login();
