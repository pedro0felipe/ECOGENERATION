module.exports = function flash(req, res, next) {
  console.log('FLASH NA SESSÃO:', req.session.flash);
  if (req.session.flash) {
    res.locals.flashMessage = req.session.flash;
    delete req.session.flash;
    req.session.save(() => next());
  } else {
    res.locals.flashMessage = null;
    next();
  }
};