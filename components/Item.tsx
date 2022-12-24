import { useState } from "react";
import label from "../lib/label";

export default ({ item, handleUpdate }) => {
  const [labelsStr, setLabelsStr] = useState(label.serialize(item.labels));
  const handleClick = (event) => {
    const labels = label.deserialize(labelsStr);
    fetch(`/api/item/${item._id}`, {
      method: "PATCH",
      body: JSON.stringify({ labels }),
    }).then(() => {
      handleUpdate();
    });
  };

  return (
    <>
      <span>{item.content}</span>{" "}
      <span>
        <input
          type="text"
          value={labelsStr}
          onChange={(e) => setLabelsStr(e.target.value)}
        />{" "}
        <button onClick={handleClick}>labels</button>
      </span>
    </>
  );
};
