import compose from "koa-compose";

import homeRouter from "./home";
import accountRouter from "./accounts";
import backtestRouter from "./backtest";
import botRouter from "./bot";
import configurationRouter from "./configuration";
import exchangesRouter from "./exchanges";

export default compose([
    homeRouter.middleware(),
    accountRouter.middleware(),
    backtestRouter.middleware(),
    botRouter.middleware(),
    configurationRouter.middleware(),
    exchangesRouter.middleware(),
]);
