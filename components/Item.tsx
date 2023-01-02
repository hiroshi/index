import { useState } from "react";
import labelutils from "../lib/labelutils";
import LabelsInput from "./LabelsInput";

export default ({ item, handleUpdate }) => {
  if (!item) {
    item = { content: "", labels: [] };
  }
  const [content, setContent] = useState(item.content);
  const [labelsStr, setLabelsStr] = useState(labelutils.serialize(item.labels));

  const handleSubmit = (event) => {
    event.preventDefault();

    const labels = labelutils.deserialize(labelsStr);
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
        setContent("");
        setLabelsStr("");
        handleUpdate();
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="title"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />{" "}
      <LabelsInput
        initialLabelsStr={labelsStr}
        onChange={(e) => setLabelsStr(e.target.value)}
      />{" "}
      <button type="submit">submit</button>
    </form>
  );
};
