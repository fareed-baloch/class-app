module.exports = {
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next;
        }
        req.flash('danger','Please login first');
        res.redirect('/users/login');
    }
}