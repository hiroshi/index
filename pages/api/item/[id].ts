import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectID } from "mongodb";
import { collectionPromise } from "../../../lib/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const item = JSON.parse(req.body);
  item.updated_at = new Date();
  console.log({ id, item });

  collectionPromise("items").then(async (coll) => {
    const result = await coll.updateOne(
      { _id: new ObjectID(id as string) },
      { $set: item }
    );
    console.log(result);
  });

  res.status(200).send("");
};
