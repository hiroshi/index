type Labels = { [k: string]: boolean };
type Item = { _id: string; labels: Labels };
type Grouped = { heading: string } | Item;

const serialize = (labels: Labels, opts: { sort?: boolean } = {}) => {
  let list = [];
  for (let label in labels) {
    if (labels[label]) {
      list.push(label);
    } else {
      list.push("!" + label);
    }
  }
  return opts.sort ? list.sort().join(" ") : list.join(" ");
};

const deserialize = (str: string, opts: { ignoreNegate?: boolean } = {}) => {
  let labels: Labels = {};
  str.split(/\s+/).forEach((label) => {
    if (label !== "") {
      const m = label.match(/^(\!)?(\w+)$/);
      if (m) {
        if (!opts.ignoreNegate || !m[1]) {
          labels[m[2]] = !m[1];
        }
      }
    }
  });
  return labels;
};

const toQueryString = (labels: Labels) => {
  let list = [];
  for (let label in labels) {
    list.push(`${label}=${labels[label]}`);
  }
  return "?" + list.join("&");
};

const fromQuery = (query: any) => {
  let labels: Labels = {};
  for (let label in query) {
    let val = query[label];
    switch (val) {
      case "true":
        val = true;
        break;
      case "false":
        val = false;
        break;
    }
    labels[label] = val;
  }
  return labels;
};

// const fromQueryString = (query: string) => {
//   let labels: Labels = {};
//   query.split(/&/).forEach((pair) => {
//     const m = pair.match(/^(\w+)=(\w+)$/);
//     if (m) {
//       let val = m[2];
//       if (val === "true") {
//         val = true;
//       }
//       labels[m[1]] = val;
//     }
//   });
//   return labels;
// };

const autoGroup = (items: Item[], filter: string) => {
  const labelsItems: { [k: string]: Item[] } = {};
  if (items.length === 0) {
    return [];
  }

  let intersection = Object.keys(items[0].labels); // Extract common labels
  items.forEach((item) => {
    const labels: string = serialize(item.labels, { sort: true });
    if (labels in labelsItems) {
      labelsItems[labels].push(item);
    } else {
      labelsItems[labels] = [item];
      intersection = intersection.filter((l) =>
        Object.keys(item.labels).includes(l)
      );
    }
  });

  let results: Array<Grouped> = [];
  for (let labels in labelsItems) {
    // Move common labels first
    const ls = intersection
      .concat(labels.split(/\s+/).filter((l) => !intersection.includes(l)))
      .join(" ");
    results.push({
      heading: ls,
      labels: Object.assign(deserialize(labels), deserialize(filter || "")),
    });
    results = results.concat(labelsItems[labels]);
  }
  return results;
};

export default { serialize, deserialize, toQueryString, fromQuery, autoGroup };
