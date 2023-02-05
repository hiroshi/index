import type { NextApiRequest, NextApiResponse } from "next";
import Items from "../../lib/items";
// import labelsutils from "../../lib/labelutils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      console.log(`POST ${req.body}`);
      const { item } = JSON.parse(req.body);

      Items.insertOne(item);

      res.status(204).send("");
      break;
    case "GET":
      const q = req.query.q as string;
      const filter: { [key: string]: any } = {};

      q.split(/\s+/).forEach((label: string) => {
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
