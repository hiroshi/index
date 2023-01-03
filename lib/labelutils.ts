export default {
  serialize: (labels) => {
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
  deserialize: (str) => {
    let labels = {};
    str.split(/\s+/).forEach((label) => {
      if (label !== "") {
        const m = label.match(/^(\!)?(\w+)$/);
        if (m) {
          labels[m[2]] = !m[1];
        }
      }
    });
    return labels;
  },
};
