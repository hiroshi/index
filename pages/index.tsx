// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { useState } from "react";
import { collectionPromise } from "../lib/mongo";

export default function Home(props) {
  // const inputRef = useRef();
  const [content, setContent] = useState("");
  const [items, setItems] = useState(props.items);

  const submitHandler = (event) => {
    event.preventDefault();

    // console.log(inputRef.current.value);
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
  const items = await collectionPromise("items").then((collection) =>
    collection
      .find({})
      .sort({ _id: "DESC" })
      .toArray()
      .then((items) =>
        items.map((item) => {
          item._id = item._id.toJSON();
          return item;
        })
      )
  );
  // console.log(items);
  return { props: { items } };
}
