const { refreshTokensForAllUsers } = require("./userTokenUtils");

const REFRESH_INTERVAL = 5 * 60 * 1000;

exports.startTokenRefreshCycle = async function recursiveRefresh() {
    await refreshTokensForAllUsers();
    let startTime = Date.now();
    let endTime = startTime + REFRESH_INTERVAL;

    function printTimeRemaining() {
        let now = Date.now();
        let timeRemaining = Math.round((endTime - now) / 1000);
        console.log(`Time until next token refresh: ${timeRemaining} seconds`);

        if (now < endTime) {
            setTimeout(printTimeRemaining, 60000);
        } else {
            exports.startTokenRefreshCycle();
        }
    }
    printTimeRemaining();
};
