const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const { json } = require('express');

//@route GET api/profile/me
//@desc get current users profile
//@access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!');
  }
});

//@route POST api/profile
//@desc Create or update users profile
//@access Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required!').not().isEmpty(),
      check('skills', 'Skills is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile object
    const profileFiels = {};
    profileFiels.user = req.user.id;
    if (company) profileFiels.company = company;
    if (website) profileFiels.website = website;
    if (location) profileFiels.location = location;
    if (bio) profileFiels.bio = bio;
    if (status) profileFiels.status = status;
    if (githubusername) profileFiels.githubusername = githubusername;
    if (skills) {
      profileFiels.skills = skills.split(',').map((skill) => skill.trim());
    }

    //build social object
    profileFiels.social = {};
    if (youtube) profileFiels.social.youtube = youtube;
    if (twitter) profileFiels.social.twitter = twitter;
    if (facebook) profileFiels.social.facebook = facebook;
    if (linkedin) profileFiels.social.linkedin = linkedin;
    if (instagram) profileFiels.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFiels },
          { new: true }
        );

        return res.json(profile);
      }

      //create

      profile = new Profile(profileFiels);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.errors(err.message);
      res.status(500).send('Server Error!');
    }
  }
);
module.exports = router;
