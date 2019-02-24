import config from "../config";

const home = (ctx) =>
    ctx.ok({
        title: "Wolfbot API",
        environment: config.environment,
    });

export default home;
