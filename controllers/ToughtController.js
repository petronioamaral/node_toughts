const { response } = require('express');
const Tought = require('../models/Tought');
const User = require('../models/User');
const {Op} = require('sequelize');

module.exports = class ToughtController {
  static async showToughts(req, res) {

    let search = '';

    if(req.query.search){
      search = req.query.search;
    }

    let order = 'DESC';

    if(req.query.order === 'old'){
      order = 'ASC'
    }else{
      order = 'DESC'
    }

    const toughtsData = await Tought.findAll({
      include: User,

      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [['createdAt', order]]

    });

    const toughts = toughtsData.map((result) => result.get({ plain: true }))
    let toughtsQty = toughts.length;

    if( toughtsQty === 0) {
      toughtsQty = false;
    }

    res.render("toughts/home", { toughts, search, toughtsQty });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });

    const toughts = user.Toughts.map((result) => result.dataValues);

    if (!user) {
      res.redirect("/login");
    }

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render("toughts/dashboard", { toughts, emptyToughts });
  }

  static async create(req, res) {
    res.render("toughts/create");
  }

  static async createSave(req, res) {
    try {
      const tought = {
        title: req.body.title,
        UserId: req.session.userid,
      };

      await Tought.create(tought);
      req.flash("message", "criado com sucesso");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;
    const tought = await Tought.findOne({ where: { id: id }, raw: true });

    console.log("tought *************", tought);

    res.render("toughts/edit", { tought });
  }

  static async updateToughtSave(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
    }

   

    try {
      
       await Tought.update(tought, { where: { id: id } });

       req.flash("message", "editado com sucesso");
       req.session.save(() => {
         res.redirect("/toughts/dashboard");
       });

    } catch (error) {
        console.log("error", error);
    }
  }

  static async removeTougth(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });
      req.flash("message", "deletado com sucesso");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log("error", error);
    }
  }
};
