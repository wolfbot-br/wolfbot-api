const ccxt = require('ccxt');
const tulind = require('tulind');


const index = async (req, res, next) => {

  let bitfinex = new ccxt.bitfinex();
  var promise = Promise.resolve(true);

  setInterval(async function () {

    let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    var high = []
    var low = []
    var close = []

    if (bitfinex.has.fetchOHLCV) {

      var hoje = new Date()
      hoje.setMinutes(hoje.getMinutes() - 30);
      var tempo = new Date(hoje).getTime();

      await sleep(bitfinex.rateLimit) // milliseconds
      result = await bitfinex.fetchOHLCV('IOTA/USDT', '1m', since = tempo, limit = 100)
      totalResult = Object.keys(result).length

      for (i = 0; i < totalResult; i++) {
        high.push(result[i][2])
        low.push(result[i][3])
        close.push(result[i][4])
      }
    }

    tulind.indicators.macd.indicator([close], [2, 5, 9], function (error, results) {
      console.log("Result of macd is:");
      console.log(results);
    });

    // console.log(tulind.indicators);

    promise = promise.then(function () {
      return new Promise(function (resolve) {
        msg = 'Bot iniciado, consulte o terminal para ver o resultado.';
        teste(msg, resolve)
      });
    });
  },
    10000
  );

  function teste(msg, resolve) {
    res.json(
      msg
    )
  }
}

module.exports = { index };
