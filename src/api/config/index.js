const { env } = process;

export default {
    port: env.PORT,
    environment: env.NODE_ENV || 'production',

    mongo: {
        connection: 'mongo',
        database: '',
        username: '',
        password: '',
    },
};
