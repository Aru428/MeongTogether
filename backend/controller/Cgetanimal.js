const apiAnimal = require("../model/GetAnimal");

exports.getApiAnimal = async (req, res) => {
  const result = await apiAnimal();

  res.send(result);
};
