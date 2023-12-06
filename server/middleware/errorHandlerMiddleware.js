
function errorHandlerMiddleware (err, req, res, next){
    if(err.statusCode === 400){
        return res.status(400).json({message: err.message})
    }else if(err.statusCode === 401){
        return res.status(401).json({message: err.message})
    }else if(err.statusCode === 403){
        return res.status(403).json({message: err.message})
    }else if(err.statusCode === 404){
        return res.status(404).json({message: err.message})
    }

    const errMsg = err.message || '500 internal server';
    // default to 500 server error
    return res.status(500).json({
        message: errMsg,
        stack: err.stack
    });
}

export default errorHandlerMiddleware