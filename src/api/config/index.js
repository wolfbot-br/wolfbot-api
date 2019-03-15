const { env } = process;

module.exports = {
    port: env.PORT,
    environment: env.NODE_ENV,

    mongo: {
        connection: `${env.MONGO_CONNECTION}/${env.MONGO_DATABASE}`,
    },
};
