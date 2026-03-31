const userService = require('../services/userService');

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { getUser };