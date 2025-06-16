const projects = require('../data/projects.json');

module.exports = (req, res) => {
  res.status(200).json(projects);
};
