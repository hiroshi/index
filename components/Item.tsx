import { useState } from "react";
import label from "../lib/label";

export default ({ item, handleUpdate }) => {
  if (!item) {
    item = { content: "", labels: [] };
  }
  const [content, setContent] = useState(item.content);
  const [labelsStr, setLabelsStr] = useState(label.serialize(item.labels));

  const handleSubmit = (event) => {
    event.preventDefault();

    const labels = label.deserialize(labelsStr);
    if (item._id) {
      fetch(`/api/item/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({ content, labels }),
      }).then(() => {
        handleUpdate();
      });
    } else {
      fetch("/api/indices", {
        method: "POST",
        body: JSON.stringify({ item: { content, labels } }),
      }).then(() => {
        handleUpdate();
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />{" "}
      <input
        type="text"
        value={labelsStr}
        onChange={(e) => setLabelsStr(e.target.value)}
      />{" "}
      <button type="submit">submit</button>
    </form>
  );
};
