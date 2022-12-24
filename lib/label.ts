export default {
  serialize: (obj) => {
    let list = [];
    for (let k in obj) {
      list.push(k);
    }
    return list.join(" ");
  },
  deserialize: (str) => {
    let labels = {};
    str.split(/\s+/).forEach((label) => {
      if (label !== "") {
        labels[label] = true;
      }
    });
    return labels;
  },
};
