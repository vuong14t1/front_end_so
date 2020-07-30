var Utils = {
  validateParamObject(data) {
    for (var i in data) {
        console.log(data[i])
      if (data[i]== "" || data[i] == null) {
          console.log(data[i], i);
        return false;
      }
    }
    return true;
  },

  checkDuplicateData(data1, data2) {
    for (let i in data1) {
      if (JSON.stringify(data1[i]) != JSON.stringify(data2[i])) {
        return true;
      }
    }
    return false;
  },
}
export default Utils
