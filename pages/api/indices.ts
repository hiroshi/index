import Items from "../../lib/items";
import labels from "../../lib/label";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      console.log(`POST ${req.body}`);
      const { item } = JSON.parse(req.body);

      Items.insertOne(item);

      res.status(204).send();
      break;
    case "GET":
      // console.log(req.query);
      const q = req.query.q;
      const filter = {};

      q.split(/\s+/).forEach((label) => {
        if (label !== "") {
          if (label.startsWith("!")) {
            filter[`labels.${label.substring(1)}`] = { $ne: true };
          } else {
            filter[`labels.${label}`] = true;
          }
        }
      });
      console.log(filter);
      const items = await Items.find(filter);
      // console.log(items);
      res.status(200).json(items);
      break;
  }
};
