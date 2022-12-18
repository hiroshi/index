import { collectionPromise } from "../../lib/mongo";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      console.log(`POST ${req.body}`);
      const { item } = JSON.parse(req.body);

      collectionPromise("items").then((items) => items.insertOne(item));

      res.status(204).send();
      break;
    case "GET":
      // const items = [{ content: "new" }];
      const items = await collectionPromise("items").then((collection) =>
        collection
          .find({})
          .sort({ _id: "DESC" })
          .toArray()
          .then((items) =>
            items.map((item) => {
              item._id = item._id.toJSON();
              return item;
            })
          )
      );
      res.status(200).json(items);
      break;
  }
};
