// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { useState } from "react";

export default function Home(props) {
  const [content, setContent] = useState("");
  const [items, setItems] = useState(props.items);

  const submitHandler = (event) => {
    event.preventDefault();
    fetch("/api/indices", {
      method: "POST",
      body: JSON.stringify({ item: { content } }),
    }).then(() => {
      fetch("/api/indices")
        .then((res) => res.json())
        .then((data) => setItems(data));
    });
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <input type="text" onChange={(e) => setContent(e.target.value)} />
        <button type="submit">submit</button>
      </form>
      <ul>
        {items.map((item) => {
          return <li key={item.content}>{item.content}</li>;
        })}
      </ul>
    </>
  );
}

export async function getServerSideProps(context) {
  return { props: { items: [{ content: "hello" }, { content: "world" }] } };
}
