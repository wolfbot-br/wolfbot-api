const { env } = process;

export default {
    port: env.PORT,
    environment: env.NODE_ENV || "production",

    mongo: {
        connection: `${env.MONGO_CONNECTION}/${env.MONGO_DATABASE}`,
    },
};
