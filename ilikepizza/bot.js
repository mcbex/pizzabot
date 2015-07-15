var SlackClient = require('slack-client');
var slack = new SlackClient('xoxb-7686470962-P65S6qvEzlQNoHkrtD2TpkPn', true, true);

function makeResponseMaybe (message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel),
        user = slack.getUserByID(message.user);

    if (~message.text.toLowerCase().indexOf('pizza')) {
        channel.send('i like pizza');
    }
}

slack.on('message', function (message) {
    console.log('[message]', message.text);
    makeResponseMaybe(message);
});

slack.on('open', console.log.bind(console, '[open]'));
slack.on('error', console.error.bind(console, '[error]'));

slack.login();

