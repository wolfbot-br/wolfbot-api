const lodash = require('lodash')
const tulind = require('tulind')

// Wrapper that executes a tulip indicator
let execute = function (callback, params) {
    let tulindCallback = function (err, result) {
        if (err) return callback(err);
        let table = {}
        for (let i = 0; i < params.results.length; ++i) {
            table[params.results[i]] = result[i];
        }
        callback(null, table);
    };

    return params.indicator.indicator(params.inputs, params.options, tulindCallback);
}

// Helper that makes sure all required parameters
// for a specific talib indicator are present.
let verifyParams = (methodName, params) => {
    let requiredParams = methods[methodName].requires;

    lodash.each(requiredParams, paramName => {
        if (!lodash.has(params, paramName))
            throw tulindError + methodName + ' requires ' + paramName + '.';

        let val = params[paramName];

        if (!lodash.isNumber(val))
            throw tulindError + paramName + ' needs to be a number';
    });
}

var methods = {};

methods.macd = {
    requires: ['optInFastPeriod', 'optInSlowPeriod', 'optInSignalPeriod'],
    create: (params) => {
        verifyParams('macd', params);

        return (data, callback) => execute(callback, {
            indicator: tulind.indicators.macd,
            inputs: [data.close],
            options: [params.optInFastPeriod, params.optInSlowPeriod, params.optInSignalPeriod],
            results: ['macd', 'macdSignal', 'macdHistogram'],
        });
    }
}

methods.sma = {
    requires: ['optInTimePeriod'],
    create: (params) => {
        verifyParams('sma', params);

        return (data, callback) => execute(callback, {
            indicator: tulind.indicators.sma,
            inputs: [data.close],
            options: [params.optInTimePeriod],
            results: ['result'],
        });
    }
}

module.exports = methods