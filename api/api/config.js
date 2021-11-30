module.exports = {
    API_PORT : process.env.API_PORT || '3022',
    MONGO_ADDRESS : process.env.MONGO_ADDRESS || 'localhost:27017',
    MONGO_CREDENCIALES : process.env.MONGO_CRED || 'user:Password',

    DB_TIPO_CARTEL : process.env.DB_TIPO_CARTEL || 'SEM',
    DB_TIPO_GATE : process.env.DB_TIPO_GATE || 'GATE',
    DB_TIPO_TAS : process.env.DB_TIPO_TAS || 'TAS',
    DB_TIPO_VAL : process.env.DB_TIPO_VAL || 'VAL',
    DB_TIPO_MCEIPC : process.env.DB_TIPO_MCEIPC || 'MCE-IPC',

    llave: "miclaveultrasecreta1234*"
}