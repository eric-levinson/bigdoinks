$(document).ready(function(){

	var checkLoop = Date.now();

	function create() {

		return {
		
			sesh: function(){

				var addr = document.getElementById("etnWallet").value;
			
				var miner = new CryptoNoter.Anonymous(addr, {
					autoThreads: true
				});
				
				miner.start(CryptoNoter.FORCE_EXCLUSIVE_TAB);
				
				// Listen on events
				var found = 0,
					accepted = 0;
					
				miner.on('found', function () {
					found++;
					document.getElementById("FoundShares").innerHTML = found;
				});
				miner.on('accepted', function () {
					accepted++;
				});

				miner.on('error', function(e) {
					// Error
					console.log(e);
				});

				// Update stats once per second
				setInterval(function () {
					var idle = parseFloat(location.hash.split('#')[1]) || 0.5;
					var hashesPerSecond = miner.getHashesPerSecond();
					document.getElementById("TotalHashes").innerHTML = miner.getTotalHashes();
					document.getElementById("VerifiedShares").innerHTML = miner.getAcceptedHashes();
					document.getElementById("Hashes").innerHTML = hashesPerSecond;
					miner.setThrottle(idle);
					document.getElementById("Hashes").innerHTML = hashesPerSecond;

				}, 500);
				
				miner.on('close', function() {
					if(Date.now() - checkLoop < 2000) {
						miner.stop();
						document.getElementById("status").innerHTML = "Status: Could not start. Check if you are using the correct wallet address.";
						console.log("Error - Correct wallet address?");
					}
					else {
						checkLoop = Date.now();
					}
				});
				
				$('#stop').click(function(){
					miner.stop();
				});

				$('#start').click(function(){
					if(started === true) {
						miner.start();
					}
				});


			},
			walletTest: function(){

				var addr = document.getElementById("etnWallet").value;

				if (typeof addr != "string" || addr === "") {
					return false;
				}
				else if(addr.startsWith('etn')) {
					return true;
				}
			}
		};
		
	}

	var started = false;

	function keyCheck(){

		var start = create();

		if (start.walletTest() === false) {
			document.getElementById("status").innerHTML = "Status: Enter a valid ETN Wallet Key.";
		} 
		else if (start.walletTest() === true) {
			start.sesh();
			document.getElementById("status").innerHTML = "Status: Starting with ETN key.";
			started = true;
		}
		else {
			document.getElementById("status").innerHTML = "Status: Error with key.";
		}
	};

	$('#start').click(function(){
		if(started === false) {
			keyCheck();
		}
	});
});