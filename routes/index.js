const express = require("express");
const router = express.Router();

const isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()) return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect("/api/user/login");
};

module.exports = function (passport) {
  /* GET login page. */
  router.get("/api/user/login", function (req, res) {
    // Display the Login page with any flash message, if any
    res.render("index", { message: req.flash("message") });
  });

  /* Handle Login POST */
  router.post(
    "/api/user/login",
    passport.authenticate("login", {
      successRedirect: "/api/user/me",
      failureRedirect: "/",
      failureFlash: true,
    })
  );

  /* GET Registration Page */
  router.get("/api/user/register", function (req, res) {
    res.render("register", { message: req.flash("message") });
  });

  /* Handle Registration POST */
  router.post(
    "/api/user/register",
    passport.authenticate("signup", {
      successRedirect: "/api/user/me",
      failureRedirect: "/signup",
      failureFlash: true,
    })
  );

  /* GET Home Page */
  router.get("/api/user/me", isAuthenticated, function (req, res) {
    res.render("home", { user: req.user });
  });

  /* Handle Logout */
  router.get("/signout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/api/user/login");
    });
  });
  return router;
};

/* GET Registration Page */
router.get("/", function (req, res) {
  res.redirect("/api/user/login");
});
