exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' })
    } else if( err.code === '22003') {
        res.status(404).send({ msg : 'Not Found'})
    } else {
        next(err)
    }
};


exports.customErrorHandler = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
}

