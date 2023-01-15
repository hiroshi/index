import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import labelutils from "../lib/labelutils";
import LabelsInput from "./LabelsInput";
import useOutsideClick from "./hooks/useOutsideClick";

export default function Item({ item, handleUpdate }: any) {
  if (!item) {
    item = {};
  }
  const [title, setTitle] = useState(item.title || "");
  const [editMode, setEditMode] = useState(!item._id);
  useEffect(() => {
    if (!item._id) {
      setEditMode(true);
    }
  }, [title]);
  const initialLabelStr = labelutils.serialize(item.labels);
  const [labelsStr, setLabelsStr] = useState(initialLabelStr);
  useEffect(() => {
    setLabelsStr(initialLabelStr);
  }, [initialLabelStr]);

  const handleClick = (event: any) => {
    if (!editMode && event.target.tagName !== "A") {
      event.preventDefault();
      setEditMode(true);
    }
  };
  const ref = useRef(null);
  useOutsideClick(ref, () => {
    console.log(item);
    if (item._id) {
      setEditMode(false);
    }
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
    return item.url ? (
      <Link href={item.url} target="_blank">
        {title}
      </Link>
    ) : (
      <span>{title}</span>
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
        <span style={{ display: "inline-block", width: "480px" }}>
          {renderTitle()}
        </span>
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
