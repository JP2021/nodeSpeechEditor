
const express = require('express');
const router = express.Router();
const db = require("../db");
const { findUser } = require('../auth');
const auth = require("../auth");
const sendMail = require("../mail");
const passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
 
      res.render("login", {title: "Speech Editor", message:""});    
   
    });
    router.get('/forgot', function(req, res, next) {
 
      res.render("forgot", {title: "Recuperação de Senha", message:""});    
   
    });

    router.post("/logout", (req, res, next)=>{
      req.logOut(()=>{
        res.redirect("/");
      }
      )
    })

    router.post('/forgot', async(req, res, next)=> {
      const email = req.body.email;
      if (!email) return res.render("forgot", {title: "Recuperação de Senha", message: "O email é obrigatório"});
      const user = await auth.findUserByEmail(email);
      if(!user)
        return res.render("forgot", {title: "Recuperação de Senha", message: "O email não está cadastrado !"});
      const newPassword = auth.generatePassword();
      user.password = newPassword;

      try{
      await db.updateUser(user._id.toString(), user);
      await sendMail(user.email, "Senha alterada com Sucesso", `
       Olá ${user.name}!
       Sua senha foi alterada com sucesso ${newPassword}
       Use-a  para se autenticar em http://localhost:3001
       
       Att.
       Admin
      `);

      res.render("Login", {title: "Login", message: "Verifique sua caixa de E-mail"});   

      }catch(err){
        res.render("forgot", {title: "Recuperação de Senha", message: err.message});   

      }
   
    });

    router.post("/login", passport.authenticate("local", {
      successRedirect: "/speechEditor",
      failureRedirect: "/?message=Usuário e/ou  senha inválidos."
    }) )



module.exports = router;