import { useState } from "react";
import label from "../lib/label";

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
        onFocus={handleFocusLabels}
        onBlur={(e) => setSuggestedLabels(null)}
      />{" "}
      <button type="submit">submit</button>
      {suggestedLabels && (
        <div>
          {suggestedLabels.map((l) => {
            return (
              <span key={l._id} style={{ margin: "1em" }}>
                {l._id}
              </span>
            );
          })}
        </div>
      )}
    </form>
  );
};
