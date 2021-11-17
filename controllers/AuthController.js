const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    //check if user exsits
    const checkIfUserExists = await User.findOne({ where: { email: email } });
    if (!checkIfUserExists) {
      req.flash("message", "o email nao existe");
      res.render("auth/login");
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, checkIfUserExists.password)
        if (!passwordMatch) {
          req.flash("message", "senha incorreta");
          res.render("auth/login");
          return;
        }

        
        try{
        //init session
      req.session.userid = checkIfUserExists.id;

      req.flash("message", "logado com sucesso");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
    }


  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    if (password != confirmpassword) {
      req.flash("message", "as senhas nao conferem");
      res.render("auth/register");
      return;
    }

    //check if user exsits
    const checkIfUserExists = await User.findOne({ where: { email: email } });
    if (checkIfUserExists) {
      req.flash("message", "o email ja ta cadastrado");
      res.render("auth/register");
      return;
    }

    // create a password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      //init session
      req.session.userid = createdUser.id;

      req.flash("message", "cadastrado com sucesso");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};