import OBJECT_CONST, {
  TIME
} from "../const/object_const";
var TimeUtil = {
  convertDuration: function (duration, unit) {
    if(duration == null) return null;
    unit = unit === undefined ? OBJECT_CONST.TIME.DAY : unit;
    return parseInt(duration / unit);
  }
}

// const instance = new TimeUtil();
export default TimeUtil
