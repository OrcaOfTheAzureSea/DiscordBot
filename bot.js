const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

var owner = '';
var channelToSendTo = '';
var awayPlayers = [];

client.login("<token>");

client.on('message', message => {
    console.log(message.content);
    var messageContent = message.content
    if (messageContent.substring(0, 1) == '!') {
        var args = messageContent.substring(1).split(' ');
        var cmd = args[0];
				
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                message.channel.send( 'Check to make sure bot works');
            break;
            // Just add any case commands if you want to..
			case 'setup':
			
                message.channel.send('Current Setup... Owner = ' + owner + ' . Channel to send to = <#' + channelToSendTo + '>.');
				
				message.channel.send('Applying new settings');
				
				owner = args[0];
				channelToSendTo = args[1];
				
                message.channel.send('New Setup... Owner = ' + owner + ' . Channel to send to = ' + channelToSendTo + '.');
                channelToSendTo = channelToSendTo.substring(2, channelToSendTo.length-1);
            break;
			case 'brb':
                var wantedChannel =client.channels.cache.get(channelToSendTo);
                awayPlayers.push(message.author.toString());
				wantedChannel.send('Hey ' + owner + ', ' + message.author.toString() + ' is going AFK for a moment.');
            break;
			case 'back':
                var wantedChannel =client.channels.cache.get(channelToSendTo);
                var x = awayPlayers.findIndex(element => element == message.author.toString());
                awayPlayers.splice(x, 1);
                
                wantedChannel.send('Hey ' + owner + ', ' + message.author.toString() + ' is back and ready for action!');
            break;

            // Kind of notification if someone has just joined maybe?
            case 'hello':
                var wantedChannel =client.channels.cache.get(channelToSendTo);
                wantedChannel.send('Hey ' + owner + ', ' + message.author.toString() + ' has just joined and is down to clown!');
            break;

            case 'list':
                var wantedChannel =client.channels.cache.get(channelToSendTo);
                wantedChannel.send('Hey '+ owner + ', here are all the players currently away:');

                var loop;
                for (loop = 0; loop < awayPlayers.length; loop++) {
                    wantedChannel.send(awayPlayers[loop]);
                }
            break;
         }
    }
});