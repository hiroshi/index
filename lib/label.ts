export default {
  serialize: (obj) => {
    let list = [];
    for (k in obj) {
      list.push(k);
    }
    return list.join(" ");
  },
  deserialize: (str) => {
    let labels = {};
    str.split(/\s+/).forEach((label) => {
      labels[label] = true;
    });
    return labels;
  },
};
