/**
 * @file nodeHealth.js
 * @author Denis Kashargin <denis@kashargin.ru>
 * @author Alexey Saliuk <alexey.saliuk@bitlle.network>
 * @site bitlle.network
 * @date 2018
 */

var NodeHealth = function (web3) {
    this.web3 = web3;
}

var defMaxDelaySec = 60;

NodeHealth.prototype.check = function (consoleLog, callback, maxDelaySec) {

    var calc = (lastBlock) => {
        var localTime = Date.now() / 1000;
        var delay = localTime - lastBlock.timestamp;
        var live = delay < (maxDelaySec ? maxDelaySec : defMaxDelaySec);
        if (consoleLog) {
            console.log("\ncheck node status...",
                "\nlast block:", lastBlock.number,
                "\ntimeStamp:", lastBlock.timestamp,
                "\nlocalTime:", localTime);
            if (!live) console.log("ATTENTION !!! node delay", delay, "seconds");
        }
        return live;
    }

    if (callback) {
        this.web3.eth.getBlock('latest', (err, res) => {
            if (err || !res) {
                if (consoleLog) console.log("ATTENTION !!! node delay request error " + err.message);
                return callback(null, false);
            } else {
                return callback(null, calc(res));
            }
        });
    } else {
        try {
            var lastBlock = this.web3.eth.getBlock('latest');
            return calc(lastBlock);
        } catch (e) {
            console.log("node heelaath check error: " + e.message);
            return false;
        }
    }
}


module.exports = NodeHealth;