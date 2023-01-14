import { useState, useEffect } from "react";
import labelutils from "../lib/labelutils";
import LabelsInput from "./LabelsInput";

export default function Item({ item, handleUpdate }: any) {
  if (!item) {
    item = { title: "", labels: [] };
  }
  const [title, setTitle] = useState(item.title);
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
        body: JSON.stringify({ title, labels }),
      }).then(() => {
        handleUpdate();
      });
    } else {
      fetch("/api/indices", {
        method: "POST",
        body: JSON.stringify({ item: { title, labels } }),
      }).then(() => {
        setTitle("");
        setLabelsStr("");
        handleUpdate();
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        style={{ width: "480px" }}
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />{" "}
      <LabelsInput
        initialLabelsStr={labelsStr}
        onChange={(e: any) => setLabelsStr(e.target.value)}
      />{" "}
      <button type="submit">submit</button>
    </form>
  );
}
