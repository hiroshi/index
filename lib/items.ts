import { collectionPromise } from "../lib/mongo";

export default {
  find: async (filter: { [key: string]: any }) => {
    return await collectionPromise("items").then((collection) =>
      collection
        .find(filter)
        .sort({ _id: "desc" })
        .toArray()
        .then((items) =>
          items.map((item) => {
            return JSON.parse(JSON.stringify(item));
          })
        )
    );
  },

  insertOne: (item: any) => {
    collectionPromise("items").then((collection) => collection.insertOne(item));
  },

  labels: async () => {
    return await collectionPromise("items").then((collection) =>
      collection
        .aggregate([
          { $project: { l: { $objectToArray: "$labels" } } },
          { $match: { "l.k": { $ne: "" } } },
          { $unwind: "$l" },
          { $group: { _id: "$l.k", count: { $count: {} } } },
        ])
        .toArray()
    );
  },
};
