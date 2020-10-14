const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const botID = '<botid>';

var serverJson = {
    owner: '',
    channelToSendTo: '',
    awayPlayers: []
};

var settingsFound = false;

client.once('ready', () => {
	console.log('Ready!');
});

client.login("<bottoken>");

client.on('message', message => {
    settingsFound = false;
    serverJson.awayPlayers = [];
    serverJson.channelToSendTo = '';
    serverJson.owner = '';

    if (message.author.id != botID) {
        var jsonFileName = message.guild.id + ".json"

        if (fs.existsSync(jsonFileName)) {
           var rawdata =  fs.readFileSync(jsonFileName);

            if (rawdata) {
                settingsFound = true;
                serverJson = JSON.parse(rawdata);
            }
        }

        var messageContent = message.content.toLowerCase();
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
                
                    if (settingsFound) {
                        message.channel.send('Current Setup... Owner = ' + serverJson.owner + ' . Channel to send to = <#' + serverJson.channelToSendTo + '>.');
				
		    		    message.channel.send('Applying new settings');
                    }
                    else {
                        message.channel.send('Creating new settings file for your server...')
                    }

			    	serverJson.owner = args[0];
                    serverJson.channelToSendTo = args[1].substring(2, args[1].length-1);
                
                    fs.writeFileSync(jsonFileName, JSON.stringify(serverJson));
				
                    message.channel.send('New Setup... Owner = ' + serverJson.owner + ' . Channel to send to = <#' + serverJson.channelToSendTo + '>.');
                break;

                // Kind of notification if someone has just joined maybe?
                case 'hello':
                    if (settingsFound) {
                        var wantedChannel =client.channels.cache.get(serverJson.channelToSendTo);
                        wantedChannel.send('Hey ' + serverJson.owner + ', ' + message.author.toString() + ' has just joined and is down to clown!');
                    }
                break;

                case 'list':
                    if (settingsFound) {
                        var wantedChannel =client.channels.cache.get(serverJson.channelToSendTo);

                        if (serverJson.awayPlayers.length > 0) {
                            wantedChannel.send('Hey '+ serverJson.owner + ', here are all the players currently away:');

                            var loop;
                            for (loop = 0; loop < serverJson.awayPlayers.length; loop++) {
                                wantedChannel.send(serverJson.awayPlayers[loop]);
                             }
                        }
                        else {
                            wantedChannel.send('Hey '+ serverJson.owner + ', all players are ready and raring to go!');
                        }
                    }
                break;

                case 'afk_info':
                    message.channel.send('Welcome to the AFKBot! Please find the details below');
                    message.channel.send('use !setup to create settings for your file and to keep track of players, use set up to set the owner of the game (they will be tagged when a player says brb) and the channel that you would like the messages sent to (a private channel is recommended)');
                    message.channel.send('e.g. !setup @Owner #OwnerChannel');
                    message.channel.send('We will let you know that these have been set up correctly after running. Please note that if you would like to use this bot to send messages to a private channel you will need to add permissions seperately. Please make sure you do this to make sure that the bottom can send and read messages to the private channel');
                    message.channel.send('use !list to get a list of players who have been marked as being away.');
                    message.channel.send('How does it work? While running we will keep an eye on all channels and see if someone mentions brb. If they do we will add that person to a list of away players and send the owner a message letting them know they are gone');
                    message.channel.send('Once the player gives a variation of back as a message (we have a few there for good measure) we will let you know they have returned!');
                break;
             }
        }
        else {
            if (settingsFound) {
		        if (messageContent.includes('brb')){

                    var x = serverJson.awayPlayers.findIndex(element => element == message.author.toString());

                    if (x == -1) {
                        var wantedChannel =client.channels.cache.get(serverJson.channelToSendTo);
                        serverJson.awayPlayers.push(message.author.toString());
                
                        fs.writeFileSync(jsonFileName, JSON.stringify(serverJson));

                        wantedChannel.send('Hey ' + serverJson.owner + ', ' + message.author.toString() + ' is going AFK for a moment.');
                    }
                }
                else if (messageContent == "back" 
                        || messageContent == "back"
                        || messageContent == "bac"
                        || messageContent == "bk" 
                        || messageContent == 'bak')
                {
                    var wantedChannel =client.channels.cache.get(serverJson.channelToSendTo);
                    var x = serverJson.awayPlayers.findIndex(element => element == message.author.toString());

                    if (x > -1) {
                        serverJson.awayPlayers.splice(x, 1);
                
                        fs.writeFileSync(jsonFileName, JSON.stringify(serverJson));

                        wantedChannel.send('Hey ' + serverJson.owner + ', ' + message.author.toString() + ' is back and ready for action!');
                    }
                }
            }
        }
    }
});