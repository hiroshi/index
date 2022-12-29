import { useState, useRef, useEffect } from "react";
import label from "../lib/label";

// https://stackoverflow.com/a/65821541/338986
/*export*/ function useOutsideClick(ref: any, onClickOut: () => void) {
  useEffect(() => {
    const onClick = ({ target }: any) =>
      !ref.contains(target) && onClickOut?.();
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

export default ({ item, handleUpdate }) => {
  if (!item) {
    item = { content: "", labels: [] };
  }
  const [content, setContent] = useState(item.content);
  const [labelsStr, setLabelsStr] = useState(label.serialize(item.labels));
  const [suggestedLabels, setSuggestedLabels] = useState(null);

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
        setContent("");
        setLabelsStr("");
        handleUpdate();
      });
    }
  };

  const handleFocusLabels = () => {
    fetch("/api/labels")
      .then((res) => res.json())
      .then((data) => setSuggestedLabels(data));
  };

  let labelsRef = useRef();
  useOutsideClick(labelsRef.current!, () => {
    setSuggestedLabels(null);
  });
  const suggestedMergin = suggestedLabels ? "1.5em" : 0;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />{" "}
      <span
        ref={labelsRef}
        style={{
          marginBottom: suggestedMergin,
          display: "inline-block",
          verticalAlign: "top",
        }}
      >
        <input
          type="text"
          value={labelsStr}
          onChange={(e) => setLabelsStr(e.target.value)}
          onFocus={handleFocusLabels}
        />
        {suggestedLabels && (
          <div style={{ position: "absolute" }}>
            {suggestedLabels.map((l) => {
              return (
                <span key={l._id} style={{ margin: "1em" }}>
                  {l._id}
                </span>
              );
            })}
          </div>
        )}
      </span>
      <button type="submit">submit</button>
    </form>
  );
};
