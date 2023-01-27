// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import labelutils from "../lib/labelutils";
import LabelsInput from "../components/LabelsInput";
import Item from "../components/Item";
import Items from "../lib/items";

export default function Index(props: any) {
  const router = useRouter();
  const [items, setItems] = useState(props.items);

  const filter = labelutils.serialize(labelutils.fromQuery(router.query));
  const setFilter = (newFilter: string) => {
    const newQueryString = labelutils.toQueryString(
      labelutils.deserialize(newFilter)
    );
    router.push(newQueryString);
    fetchItems();
  };

  const fetchItems = () => {
    fetch(`/api/indices?q=${filter}`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  const groupedItems: any[] = labelutils.autoGroup(items);

  return (
    <div style={{ margin: "1em 2em" }}>
      <div style={{ marginBottom: "1em" }}>
        filter:{" "}
        <LabelsInput
          initialLabelsStr={filter}
          onChange={(e: any) => setFilter(e.target.value)}
          negate={true}
        />
      </div>

      <div style={{ marginBottom: "1em", marginLeft: "1em" }}>
        <Item
          item={{
            labels: labelutils.deserialize(filter, { ignoreNegate: true }),
          }}
          handleUpdate={fetchItems}
        />
      </div>

      {groupedItems.map((item) => {
        if (!item._id) {
          return (
            <h5 key={item.heading} style={{ marginBottom: 0 }}>
              <Link href={labelutils.toQueryString(item.labels)}>
                {item.heading}
              </Link>
            </h5>
          );
        } else {
          return (
            <div
              key={item._id}
              className="list-item"
              style={{ display: "list-item", marginLeft: "1em" }}
            >
              <Item item={item} handleUpdate={fetchItems} />
            </div>
          );
        }
      })}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const items = await Items.find({});
  return { props: { items } };
}
