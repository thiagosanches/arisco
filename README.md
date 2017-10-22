# arisco
An unexpected Telegram/Raspberry journey.

# Installation

`$ git clone https://github.com/thiagosanches/arisco.git`

`$ cd arisco`

`$ npm install node-telegram-bot-api`

`$ node arisco.js`

# How to configure ?

There is a `config.json` file that should be configured like the following example:

<pre><code>
{	
	"authorizationToken" : "YOUR BOT TOKEN GOES HERE",
	"config" : {
		"adminUsers" : [1, 2], /*chatId from users that you are considering as admin. You can get this information right after send a message to your bot*/
		"selfies" : ["assets/arisco1.jpeg", "assets/arisco2.jpeg"],
		"customCommands" : [
			{ 
				"mycommand1" : ["my inline commands goes here"],
				"executeWithSpawn" : true /*this will run the process as an isolated shell, good for shutdown and halt commands*/
			},
			{
				"testing" : "echo 'not executing with spawn'"
			}
		],
		"deniedCommands" : ["rm", "rmdir", "shutdown", "halt", "sudo", "mv", "touch", "chmod", "wget", "curl", "echo"]
	}
}
</code></pre>
