import axios from "axios";
import Config from "../config/Config";
import ERROR_CODE from '../const/error_code';
import router from "../router";

const MODE = Config.SERVER_MODE;
const HOST = Config["SERVER_HOST"][MODE];
const BASE_URL = `${HOST}/`;

class APICaller {
  test() {
    console.log(BASE_URL + 'online')
    axios.get(BASE_URL + 'online')
      .then(function (res) {
        console.log(res.data);
      })
  }
  getWithParams(endpoint, header, params, successCallback, errorCallback) {
    let url = BASE_URL + endpoint;
    header.timeout = 15000;
    axios.get(url, {
        headers: header,
        params: params
      }, header)
      .then(successCallback)
      .catch(errorCallback);
  }
  get(endpoint, header, successCallback, errorCallback, updateUI) {
    axios.defaults.withCredentials = true
    let url = BASE_URL + endpoint;
    header.timeout = 15000;
    header.headers = Object.assign(header.headers, {
      "access-control-allow-origin": "*"
    });
    axios.get(url, header)
      .then(function (response) {
        if (response.data.errorCode == ERROR_CODE.NOT_LOGIN) {
          updateUI(Math.round(+new Date() / 1000), "Yêu cầu đăng nh!", "danger");
          setTimeout(function () {
            router.push('Login').catch(e => {})
          }.bind(this), 1000)
        } else {
          successCallback(response);
        }
      })
      .catch(function (error) {
        errorCallback(error);
      })
  }

  post(endpoint, header, bodyData, successCallback, errorCallback, updateUI) {
    axios.defaults.withCredentials = true
    let url = BASE_URL + endpoint;
    console.log("API CALL: " + url);
    header.timeout = header.timeout == undefined ? 15000 : header.timeout;
    header.headers = Object.assign(header.headers, {
      "access-control-allow-origin": "*"
    });
    axios.post(url, bodyData, header)
      .then(function (response) {
        if (response.data.errorCode == ERROR_CODE.NOT_LOGIN) {
          updateUI(Math.round(+new Date() / 1000), "Yêu cầu đăng nh!", "danger");
          setTimeout(function () {
            router.push('Login').catch(e => {})
          }.bind(this), 1000)
        } else if (response.data.errorCode == ERROR_CODE.NOT_PERMISSION) {
          alert('Not permision');
          return;
        } else {
          successCallback(response);
        }
      })

      .catch(function (error) {
        errorCallback(error);
      })
  }
}

const instance = new APICaller();
export default instance;
