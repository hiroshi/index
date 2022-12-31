import { useState, useRef, useEffect } from "react";
import label from "../lib/label";

// https://stackoverflow.com/a/65821541/338986
/*export*/ function useOutsideClick(ref: any, onClickOut: () => void) {
  useEffect(() => {
    const onClick = ({ target }: any) =>
      ref.current && !ref.current.contains(target) && onClickOut?.();
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

export default ({ initialLabelsStr, onChange }) => {
  const [labelsStr, setLabelsStr] = useState(initialLabelsStr);
  const [suggestedLabels, setSuggestedLabels] = useState(null);

  const handleFocusLabels = () => {
    fetch("/api/labels")
      .then((res) => res.json())
      .then((data) => setSuggestedLabels(data));
  };

  const labelsRef = useRef();
  useOutsideClick(labelsRef, () => {
    setSuggestedLabels(null);
  });
  const suggestedMergin = suggestedLabels ? "1.5em" : 0;

  const labelsInputRef = useRef();
  const handleSelectLabel = (label) => {
    if (labelsStr.match(/^\s*$/)) {
      setLabelsStr(label);
    } else {
      setLabelsStr(labelsStr + " " + label);
    }
    labelsInputRef.current.focus();
  };

  useEffect(() => {
    onChange({ target: { value: labelsStr } });
  }, [labelsStr]);

  return (
    <span
      ref={labelsRef}
      style={{
        marginBottom: suggestedMergin,
        display: "inline-block",
        verticalAlign: "top",
      }}
    >
      <input
        ref={labelsInputRef}
        type="text"
        value={labelsStr}
        onChange={(e) => setLabelsStr(e.target.value)}
        onFocus={handleFocusLabels}
      />
      {suggestedLabels && (
        <div style={{ position: "absolute" }}>
          {suggestedLabels.map((l) => {
            return (
              <button
                key={l._id}
                style={{ margin: "0 2px" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectLabel(l._id);
                }}
              >
                {l._id}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
};
