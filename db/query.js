let connection = require('./db')

module.exports = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, data) => {
            if (error) {
                reject({
                    msg: 'error',
                    error
                })
            } else {
                resolve({
                    msg: 'success',
                    data
                })
            }
        })
    })
}