type Labels = { [k: string]: boolean };
type Item = { _id: string; labels: Labels };
type Grouped = { heading: string } | Item;

export default {
  serialize: (labels: Labels) => {
    let list = [];
    for (let label in labels) {
      if (labels[label]) {
        list.push(label);
      } else {
        list.push("!" + label);
      }
    }
    return list.join(" ");
  },

  deserialize: (str: string, opts: { ignoreNegate?: boolean } = {}) => {
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
  },

  autoGroup: (items: Item[]) => {
    const labelsItems: { [k: string]: Item[] } = {};

    items.forEach((item) => {
      for (let label in item.labels) {
        if (label in labelsItems) {
          labelsItems[label].push(item);
        } else {
          labelsItems[label] = [item];
        }
      }
    });
    // console.log(labelsItems);

    let results: Array<Grouped> = [];
    for (let label in labelsItems) {
      // console.log(label);
      // console.log(labelsItems[label]);
      if (labelsItems[label].length < items.length) {
        results.push({ heading: label });
        results = results.concat(labelsItems[label]);
      }
    }
    return results;
  },
};
