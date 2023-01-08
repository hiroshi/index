import { useState, useRef, useEffect } from "react";
import labelutils from "../lib/labelutils";

// https://stackoverflow.com/a/65821541/338986
/*export*/ function useOutsideClick(ref: any, onClickOut: () => void) {
  useEffect(() => {
    const onClick = ({ target }: any) => {
      !ref.current?.contains(target) && onClickOut?.();
    };
    // https://github.com/facebook/react/issues/20325#issuecomment-732707240
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick);
  }, []);
}

const Labels = ({
  suggestedLabels,
  parentRef,
  labelsStr,
  negate,
  handleSelectLabel,
  setSuggestedLabels,
}: any) => {
  useOutsideClick(parentRef, () => {
    setSuggestedLabels(null);
  });

  return (
    <div style={{ position: "absolute" }}>
      {suggestedLabels.map((l: any) => {
        let caption = l._id;
        if (labelsStr.match(new RegExp(`\\b${l._id}\\b`))) {
          caption = negate ? `!${l._id}` : <s>{caption}</s>;
        }

        return (
          <button
            key={l._id}
            style={{ margin: "0 2px" }}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSelectLabel(l._id);
            }}
          >
            {caption}
          </button>
        );
      })}
    </div>
  );
};

interface Props {
  initialLabelsStr: string;
  onChange: Function;
  negate?: boolean;
}

export default function LabelsInput({
  initialLabelsStr,
  onChange,
  negate,
}: Props) {
  const [suggestedLabels, setSuggestedLabels] = useState(null);

  const [labelsStr, setLabelsStr] = useState(initialLabelsStr);
  useEffect(() => {
    setLabelsStr(initialLabelsStr);
  }, [initialLabelsStr]);

  const handleFocusLabels = () => {
    fetch("/api/labels")
      .then((res) => res.json())
      .then((data) => setSuggestedLabels(data));
  };

  const labelsRef = useRef(null);
  const suggestedMergin = suggestedLabels ? "1.5em" : 0;

  const labelsInputRef = useRef(null);
  const handleSelectLabel = (label: string) => {
    if (labelsStr.match(/^\s*$/)) {
      setLabelsStr(label);
    } else {
      const labels = labelutils.deserialize(labelsStr);
      for (const l in labels) {
        if (label === l) {
          if (negate) {
            labels[l] = !labels[l];
          } else {
            delete labels[l];
          }
          setLabelsStr(labelutils.serialize(labels));
          return;
        }
      }
      setLabelsStr(labelsStr + " " + label);
    }
    // labelsInputRef.current.focus();
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
        placeholder="labels"
        value={labelsStr}
        onChange={(e) => setLabelsStr(e.target.value)}
        onFocus={handleFocusLabels}
      />
      {suggestedLabels && (
        <Labels
          suggestedLabels={suggestedLabels}
          parentRef={labelsRef}
          labelsStr={labelsStr}
          negate={negate}
          handleSelectLabel={handleSelectLabel}
          setSuggestedLabels={setSuggestedLabels}
        />
      )}
    </span>
  );
}
