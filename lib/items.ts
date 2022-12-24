import { collectionPromise } from "../lib/mongo";

export default {
  find: async (filter) => {
    return await collectionPromise("items").then((collection) =>
      collection
        .find(filter)
        .sort({ _id: "DESC" })
        .toArray()
        .then((items) =>
          items.map((item) => {
            item._id = item._id.toJSON();
            return item;
          })
        )
    );
  },
  insertOne: (item) => {
    collectionPromise("items").then((collection) => collection.insertOne(item));
  },
};
