import { useState } from "react";

export default ({ handleUpdate }) => {
  const [content, setContent] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();

    fetch("/api/indices", {
      method: "POST",
      body: JSON.stringify({ item: { content } }),
    }).then(() => {
      handleUpdate();
    });
  };

  return (
    <form onSubmit={submitHandler}>
      <input type="text" onChange={(e) => setContent(e.target.value)} />{" "}
      <button type="submit">create</button>
    </form>
  );
};
