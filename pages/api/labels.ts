import type { NextApiRequest, NextApiResponse } from "next";
import items from "../../lib/items";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(await items.labels());
};
