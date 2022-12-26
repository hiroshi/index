import items from "../../lib/items";

export default async (req, res) => {
  res.status(200).json(await items.labels());
};
