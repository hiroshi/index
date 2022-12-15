export default (req, res) => {
  switch (req.method) {
    case "POST":
      console.log(`POST ${req.body}`);
      const { item } = JSON.parse(req.body);
      res.status(204).send();
      break;
    case "GET":
      res.status(200).json([{ content: "new" }]);
      break;
  }
};
