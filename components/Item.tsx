import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import cx from "classnames";

import labelutils from "../lib/labelutils";
import LabelsInput from "./LabelsInput";
import useOutsideClick from "./hooks/useOutsideClick";

export default function Item({ item, handleUpdate }: any) {
  if (!item) {
    item = {};
  }
  const [title, setTitle] = useState(item.title || "");

  const [editTarget, setEditTarget]: any = useState(null);
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
      // console.log(event.target);
      setEditTarget(event.target);
      setEditMode(true);
    }
  };
  const ref = useRef(null);
  useOutsideClick(ref, () => {
    // console.log(item);
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
        setEditMode(false);
        handleUpdate();
      });
    } else {
      fetch("/api/indices", {
        method: "POST",
        body: JSON.stringify({ item: { title, labels } }),
      }).then(() => {
        setTitle("");
        setLabelsStr(initialLabelStr);
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
      style={{ margin: "2px 0" }}
      className={cx({ item: true, edit: editMode })}
      ref={ref}
      onSubmit={handleSubmit}
      onClick={handleClick}
    >
      {editMode ? (
        <>
          <input
            style={{ width: "480px", fontSize: "16px" }}
            type="text"
            placeholder="title"
            autoFocus={editTarget && editTarget.tagName !== "INPUT"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />{" "}
          <LabelsInput
            initialLabelsStr={labelsStr}
            onChange={(e: any) => setLabelsStr(e.target.value)}
          />{" "}
          <button style={{ verticalAlign: "top" }} type="submit">
            submit
          </button>
        </>
      ) : (
        <span
          style={{
            display: "inline-block",
            fontSize: "16px",
            fontFamily: "Roboto,Helvetica,Arial,Hiragino Sans,sans-serif",
            paddingLeft: "4px",
          }}
        >
          {renderTitle()}
        </span>
      )}
    </form>
  );
}
