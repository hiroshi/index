// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react";
import LabelsInput from "../components/LabelsInput";
import Item from "../components/Item";
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
        filter:{" "}
        <LabelsInput
          initialLabelsStr=""
          onChange={(e) => updateFilter(e.target.value)}
        />
      </div>

      <ul>
        <li>
          <Item handleUpdate={fetchItems} />
        </li>
      </ul>

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
