import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectID } from "mongodb";
import { collectionPromise } from "../../../lib/mongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  console.log(id);
  console.log(req.body);
  const item = JSON.parse(req.body);

  collectionPromise("items").then(async (coll) => {
    const result = await coll.updateOne(
      { _id: new ObjectID(id as string) },
      { $set: item }
    );
    console.log(result);
  });

  res.status(200).send("");
};
