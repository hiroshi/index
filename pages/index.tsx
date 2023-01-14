// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react";
import labelutils from "../lib/labelutils";
import LabelsInput from "../components/LabelsInput";
import Item from "../components/Item";
import Items from "../lib/items";

export default function Home(props: any) {
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState(props.items);

  const updateFilter = (filter: any) => {
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
          onChange={(e: any) => updateFilter(e.target.value)}
          negate={true}
        />
      </div>

      <ul>
        <li>
          <Item
            item={{
              labels: labelutils.deserialize(filter, { ignoreNegate: true }),
            }}
            handleUpdate={fetchItems}
          />
        </li>
      </ul>

      <ul>
        {items.map((item: any) => {
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

export async function getServerSideProps(context: any) {
  const items = await Items.find({});
  return { props: { items } };
}
