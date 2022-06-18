var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const auth = require("../middleware");
const studyResult = require("../models/studyResult");
const user = require("../models/userModel");

/* GET home page. */
router.get("/", auth, function (req, res, next) {
  res.render("pages/index", {
    page: "Home",
    menuId: "home",
    isLoggedIn: req.isLoggedIn,
  });
});

router.get("/about", function (req, res, next) {
  res.render("pages/about", {
    page: "About Us",
    menuId: "about",
    isLoggedIn: req.isLoggedIn,
  });
});

router.get("/contact", auth, function (req, res, next) {
  res.render("pages/contact", {
    page: "Contact Us",
    menuId: "contact",
    isLoggedIn: req.isLoggedIn,
  });
});

router.get("/login", function (req, res) {
  // Render index page
  res.render("pages/login", {
    page: "login",
    menuId: "login",
    isLoggedIn: req.isLoggedIn,
    error: "",
  });
});

router.post("/authenticate", async (req, res) => {
  const { userName, password } = req.body;
  let isAUser = await user.findOne({ userName, password });
  if (isAUser) {
    let token = jwt.sign(
      { userName, password, _id: isAUser._id.toString() },
      "1234567890"
    );
    res.cookie("token", token, { signed: true });
    res.redirect("/");
  } else {
    res.render("pages/login", {
      page: "login",
      menuId: "login",
      isLoggedIn: false,
      error: "Username or password is incorrect",
    });
  }
});
router.get("/attributes", auth, function (req, res, next) {
  res.render("pages/attributes", {
    page: "Attributes",
    menuId: "Attributes",
    isLoggedIn: req.isLoggedIn,
  });
});

router.get("/takeStudy", auth, function (req, res, next) {
  res.render("pages/takeStudy", {
    page: "Take The Study",
    menuId: "Take The Study",
    isLoggedIn: req.isLoggedIn,
  });
});
router.get("/takeStudy_2", auth, function (req, res, next) {
  res.render("pages/takeStudy_2", {
    page: "Take The Study",
    menuId: "Take The Study",
    isLoggedIn: req.isLoggedIn,
  });
});
router.get("/takeStudy_3", auth, function (req, res, next) {
  res.render("pages/takeStudy_3", {
    page: "Take The Study",
    menuId: "Take The Study",
    isLoggedIn: req.isLoggedIn,
  });
});
router.get("/takeStudy_4", auth, function (req, res, next) {
  res.render("pages/takeStudy_4", {
    page: "Take The Study",
    menuId: "Take The Study",
    isLoggedIn: req.isLoggedIn,
  });
});

router.get("/logout", auth, function (req, res, next) {
  res.clearCookie("token");
  res.redirect("/");
  res.end();
});

router.post("/save-result", auth, async (req, res) => {
  try {
    const isResultAvailable = await studyResult.findOne({ userId: req.userId });
    if (isResultAvailable) {
      await studyResult.findOneAndUpdate(
        { userId: req.userId, },
        { results: req.body }
      );
      res.status(200).send({
        err: false,
        msg: "Successfully sumbitted",
      });
      return;
    }
    const questinnaire = new studyResult({
      userId: mongoose.Types.ObjectId(req.userId),
      results: req.body,
    });
    const save = await questinnaire.save();
    res.status(200).send({
      err: false,
      msg: "Successfully sumbitted",
    });
  } catch (e) {
    res.status(500).send({
      err: false,
      msg: "Unexpected error",
    });
  }
});
router.get("/mdashboard", auth, async (req, res, next) => {
  var attributes = [
    "Company Mission",
    "Senior Leadership",
    "Life Balance",
    "Management Support",
    "Personal Connection",
    "Purpose",
    "Value Alignment",
    "Wellbeing",
    "Work Environment",
    "Influences",
  ];
  const _studyResult = await studyResult.find({});
  const emotions = [
    "happy",
    "grateful",
    "hopeful",
    "proud",
    "passionate",
    "angry",
    "confused",
    "disgusted",
    "sad",
    "fearful",
    "other",
  ];
  const optimalEmotions = [
    "happy",
    "grateful",
    "hopeful",
    "proud",
    "passionate",
  ];
  let graphData = {};
  let optimalGraphData = {};
  emotions.forEach((x) => {
    graphData[x] = [...attributes.map((i) => 0)];
  });
  optimalEmotions.forEach((x) => {
    optimalGraphData[x] = [...attributes.map((i) => 0)];
  });

  _studyResult.forEach((data) => {
    attributes.forEach((a, i) => {
      const attributedData = data.results.filter((x) => x.attribute === a);
      if (attributedData && attributedData.length) {
        attributedData.forEach((d) => {
          if (d.emotion) {
            graphData[d.emotion.toLowerCase()][i] =
              graphData[d.emotion.toLowerCase()][i] + 1;
          }
          if (d.optimal && optimalEmotions.includes(d.optimal.toLowerCase())) {
            optimalGraphData[d.optimal.toLowerCase()][i] =
              optimalGraphData[d.optimal.toLowerCase()][i] + 1;
          }
        });
      }
    });
  });

  res.render("pages/mdashboard", {
    page: "Management Dashboard",
    menuId: "Management Dashboard",
    isLoggedIn: true,
    fearful: JSON.stringify(graphData.fearful),
    sad: JSON.stringify(graphData.sad),
    angry: JSON.stringify(graphData.angry),
    disgusted: JSON.stringify(graphData.disgusted),
    confused: JSON.stringify(graphData.confused),
    passionate: JSON.stringify(graphData.passionate),
    proud: JSON.stringify(graphData.proud),
    hopeful: JSON.stringify(graphData.hopeful),
    grateful: JSON.stringify(graphData.grateful),
    happy: JSON.stringify(graphData.happy),
    other: JSON.stringify(graphData.other),
    opt_passionate: JSON.stringify(optimalGraphData.passionate),
    opt_proud: JSON.stringify(optimalGraphData.proud),
    opt_hopeful: JSON.stringify(optimalGraphData.hopeful),
    opt_grateful: JSON.stringify(optimalGraphData.grateful),
    opt_happy: JSON.stringify(optimalGraphData.happy),
  });
});
router.get("/adashboard", auth, async (req, res, next) => {
  var attributes = [
    "Company Mission",
    "Senior Leadership",
    "Life Balance",
    "Management Support",
    "Personal Connection",
    "Purpose",
    "Value Alignment",
    "Wellbeing",
    "Work Environment",
    "Influences",
  ];
  const _studyResult = await studyResult.find({ userId: req.userId });
  const emotions = [
    "happy",
    "grateful",
    "hopeful",
    "proud",
    "passionate",
    "angry",
    "confused",
    "disgusted",
    "sad",
    "fearful",
    "other",
  ];
  const optimalEmotions = [
    "happy",
    "grateful",
    "hopeful",
    "proud",
    "passionate",
  ];
  let graphData = {};
  let optimalGraphData = {};
  emotions.forEach((x) => {
    graphData[x] = [...attributes.map((i) => 0)];
  });
  optimalEmotions.forEach((x) => {
    optimalGraphData[x] = [...attributes.map((i) => 0)];
  });

  _studyResult.forEach((data) => {
    attributes.forEach((a, i) => {
      const attributedData = data.results.filter((x) => x.attribute === a);
      if (attributedData && attributedData.length) {
        attributedData.forEach((d) => {
          if (d.emotion) {
            graphData[d.emotion.toLowerCase()][i] =
              graphData[d.emotion.toLowerCase()][i] + 1;
          }
          if (d.optimal && optimalEmotions.includes(d.optimal.toLowerCase())) {
            optimalGraphData[d.optimal.toLowerCase()][i] =
              optimalGraphData[d.optimal.toLowerCase()][i] + 1;
          }
        });
      }
    });
  });

  res.render("pages/adashboard", {
    page: "Management Dashboard",
    menuId: "Management Dashboard",
    isLoggedIn: true,
    fearful: JSON.stringify(graphData.fearful),
    sad: JSON.stringify(graphData.sad),
    angry: JSON.stringify(graphData.angry),
    disgusted: JSON.stringify(graphData.disgusted),
    confused: JSON.stringify(graphData.confused),
    passionate: JSON.stringify(graphData.passionate),
    proud: JSON.stringify(graphData.proud),
    hopeful: JSON.stringify(graphData.hopeful),
    grateful: JSON.stringify(graphData.grateful),
    happy: JSON.stringify(graphData.happy),
    other: JSON.stringify(graphData.other),
    opt_passionate: JSON.stringify(optimalGraphData.passionate),
    opt_proud: JSON.stringify(optimalGraphData.proud),
    opt_hopeful: JSON.stringify(optimalGraphData.hopeful),
    opt_grateful: JSON.stringify(optimalGraphData.grateful),
    opt_happy: JSON.stringify(optimalGraphData.happy),
  });
});

router.post("/create-user", async (req, res, next) => {
  const { userName, password, pwd } = req.body;
  try {
    const saveUser = new user({
      userName,
      password,
    });
    const save = await saveUser.save();
    res.status(200).send({
      err: false,
      msg: "Successfully sumbitted",
    });
  }
  catch(e) {
    res.status(500).send({
      err: true,
      msg: "Unexpected error",
    });
  }
  
});

module.exports = router;
