module.exports = function(req, res, next) {
    if (req.user.user.isAdmin === false) return res.status(403).send('Access denied.')
    next()
}