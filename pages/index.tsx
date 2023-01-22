// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react";
import labelutils from "../lib/labelutils";
import LabelsInput from "../components/LabelsInput";
import Item from "../components/Item";
import Items from "../lib/items";

export default function Index(props: any) {
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

  const groupedItems: any[] = labelutils.autoGroup(items);
  // console.log(groupedItems);

  let lastHeading = "";
  return (
    <div style={{ margin: "1em 2em" }}>
      <div style={{ marginBottom: "1em" }}>
        filter:{" "}
        <LabelsInput
          initialLabelsStr=""
          onChange={(e: any) => updateFilter(e.target.value)}
          negate={true}
        />
      </div>

      <div style={{ marginBottom: "1em" }}>
        <Item
          item={{
            labels: labelutils.deserialize(filter, { ignoreNegate: true }),
          }}
          handleUpdate={fetchItems}
        />
      </div>

      {groupedItems.map((item) => {
        if (item.heading) {
          lastHeading = item.heading;
          return <h5 key={item.heading}>{item.heading}</h5>;
        } else {
          return (
            <div
              key={lastHeading + item._id}
              className="list-item"
              style={{ display: "list-item" }}
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
