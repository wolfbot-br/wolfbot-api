const ccxt = require("ccxt");

const convertTimeStampToHours = (timeStamp) => {
    const decodedDate = new Date(timeStamp * 1000);
    const hours = decodedDate.getHours();
    const minutes = decodedDate.getMinutes();
    const seconds = `0${decodedDate.getSeconds()}`;
    const formatedHour = hours + ":" + minutes.toString().substr(-2) + ":" + seconds.substr(-2);
    return formatedHour;
};

const selecionarExchange = (dados) => {
    switch (dados) {
        case "bitfinex":
            let bitfinex = new ccxt.bitfinex();
            return bitfinex;
        case "bittrex":
            let bittrex = new ccxt.bittrex();
            return bittrex;
        default:
            throw new Error("Exchange não implementado");
    }
};

module.exports = {
    convertTimeStampToHours,
    selecionarExchange,
};
