const ccxt = require('ccxt');
const tulind = require('tulind');


const index = async (req, res, next) => {

  // var open = [4, 5, 5, 5, 4, 4, 4, 6, 6, 6];
  // var high = [9, 7, 8, 7, 8, 8, 7, 7, 8, 7];
  // var low = [1, 2, 3, 3, 2, 1, 2, 2, 2, 3];
  // var close = [4, 5, 6, 6, 6, 5, 5, 5, 6, 4];
  // var volume = [123, 232, 212, 232, 111, 232, 212, 321, 232, 321];

  // console.log(tulind.indicators);

  // tulind.indicators.sma.indicator([close], [3], function (error, results) {
  //   console.log("Result of sma is:");
  //   console.log(results[0]);
  // });

  let bitfinex = new ccxt.bitfinex();
  var promise = Promise.resolve(true);

  setInterval(async function () {
    result = await bitfinex.fetchTicker('IOTA/USDT');
    console.log(result)
    promise = promise.then(function () {
      return new Promise(function (resolve) {
        teste(result, resolve)
      });
    });
  },
    10000
  );

  function teste(result, resolve) {
    res.json({
      result
    })
  }
};

module.exports = { index };
