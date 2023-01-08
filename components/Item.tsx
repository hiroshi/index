import { useState, useEffect } from "react";
import labelutils from "../lib/labelutils";
import LabelsInput from "./LabelsInput";

export default ({ item, handleUpdate }: any) => {
  if (!item) {
    item = { content: "", labels: [] };
  }
  const [content, setContent] = useState(item.content);
  const initialLabelStr = labelutils.serialize(item.labels);
  const [labelsStr, setLabelsStr] = useState(initialLabelStr);
  useEffect(() => {
    setLabelsStr(initialLabelStr);
  }, [initialLabelStr]);

  const handleSubmit = (event: any) => {
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
        onChange={(e: any) => setLabelsStr(e.target.value)}
      />{" "}
      <button type="submit">submit</button>
    </form>
  );
};
