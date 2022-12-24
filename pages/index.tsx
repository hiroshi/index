// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react";
import Item from "../components/Item";
import NewItem from "../components/NewItem";
import Items from "../lib/items";

export default function Home(props) {
  // const inputRef = useRef();
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState(props.items);

  const updateFilter = (filter) => {
    setFilter(filter);
  };

  const fetchItems = () => {
    fetch(`/api/indices?q=${filter}`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  useEffect(() => {
    fetchItems();
  }, [filter]);

  return (
    <>
      <div>
        filter:
        <input type="text" onChange={(e) => updateFilter(e.target.value)} />
      </div>

      <NewItem handleUpdate={fetchItems} />

      <ul>
        {items.map((item) => {
          return (
            <li key={item._id}>
              <Item item={item} handleUpdate={fetchItems} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export async function getServerSideProps(context) {
  const items = await Items.find();
  return { props: { items } };
}
