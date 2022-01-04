// module.exports = func => (req,res,next)=>{
//     Promise.resolve(func(req,res,next)).catch(next);
// }

module.exports = (func) => {
    return (req,res,next) => {
        return Promise.resolve(func(req,res,next)).catch(next);
    }

}