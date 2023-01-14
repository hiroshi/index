import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import labelutils from "../lib/labelutils";
import LabelsInput from "./LabelsInput";
import useOutsideClick from "./hooks/useOutsideClick";

export default function Item({ item, handleUpdate }: any) {
  if (!item) {
    item = { title: "", labels: [] };
  }
  const [title, setTitle] = useState(item.title);
  const [editMode, setEditMode] = useState(title === "");
  const initialLabelStr = labelutils.serialize(item.labels);
  const [labelsStr, setLabelsStr] = useState(initialLabelStr);
  useEffect(() => {
    setLabelsStr(initialLabelStr);
  }, [initialLabelStr]);

  const handleClick = (event: any) => {
    console.log(event.target.tagName);
    if (!editMode && event.target.tagName !== "A") {
      event.preventDefault();
      setEditMode(true);
    }
  };
  const ref = useRef(null);
  useOutsideClick(ref, () => {
    setEditMode(false);
  });

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

  const renderTitle = () => {
    const style = { display: "inline-block", width: "480px" };
    return item.url ? (
      <Link style={style} href={item.url} target="_blank">
        {title}
      </Link>
    ) : (
      <span style={style}>{title}</span>
    );
  };

  return (
    <form
      style={{ display: "inline" }}
      ref={ref}
      onSubmit={handleSubmit}
      onClick={handleClick}
    >
      {editMode ? (
        <input
          style={{ width: "480px" }}
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        renderTitle()
      )}{" "}
      <LabelsInput
        initialLabelsStr={labelsStr}
        onChange={(e: any) => setLabelsStr(e.target.value)}
      />{" "}
      <button style={{ verticalAlign: "top" }} type="submit">
        submit
      </button>
    </form>
  );
}
