exports.getDashboard = (req, res) => {
  res.send({ message: 'Instructor Dashboard Access Granted!' });
};

exports.getContentManagement = (req, res) => {
  res.send({ message: 'Instructor Content Management Access Granted!' });
};

exports.getDragDropActivity = (req, res) => {
  res.send({ message: 'Drag and Drop!' });
};

exports.getCompiler = (req, res) => {
  res.send({ message: 'Welcome to the CodeLab!' });
};
