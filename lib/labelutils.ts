type Labels = { [k: string]: boolean };

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
  deserialize: (str: string) => {
    let labels: Labels = {};
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
