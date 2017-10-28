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
	"authorizationToken" : "YOUR_TOKEN_GOES_HERE",
	"config" : {
		"adminUsers" : [1,2,3],
		"selfies" : ["assets/arisco1.jpeg", "assets/arisco2.jpeg"],
		"customCommands" : [
			{ 
				"command1" : ["my command 1"],
				"executeWithSpawn" : true
			},
			{
				"testing" : "echo 'not executing with spawn'"
			}
		],
		"deniedCommands" : ["rm", "rmdir", "shutdown", "halt", "sudo", "mv", "touch", "chmod", "wget", "curl", "echo"]
	}
}
</code></pre>
