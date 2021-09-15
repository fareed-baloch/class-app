module.exports = {
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
           // console.log(req.user);
            return next();
        }
        req.flash('danger','Please login first');
        res.redirect('/users/login');
    }
}