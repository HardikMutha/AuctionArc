const userModel = require("../models/user");

const getUserFromId = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(404).json({ message: "Invalid ID, User Not Found" });
  try {
    const foundUser = await userModel.findById(id);
    if (!foundUser) return res.status(404).json({ message: "User Not Found" });
    res.status(200).json({ foundUser });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Invalid User Id" });
  }
};

module.exports = { getUserFromId };
