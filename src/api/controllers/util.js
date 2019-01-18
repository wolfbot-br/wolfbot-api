import ccxt from 'ccxt';

const listAllExchanges = (req, res, next) => {
  res.status(200).json({ exchanges: ccxt.exchanges });
};

export default { listAllExchanges };
