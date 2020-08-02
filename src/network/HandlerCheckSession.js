// import MemoryUtil from "../util/MemoryUtil";
// import MetadataUtils from "../util/MetadataUtils";
// import { EventBus } from "../components/event-bus"
// import APICaller from "./APICaller";

// class HandlerCheckSession {
//   constructor() {

//   }

//   checkSession(curPage, callback) {
//     let accessToken = curPage.$cookies.get("connect.id");
//     if (accessToken == null) {
//       window.location.href = "/#/google-login";
//       return;
//     }

//     let header = {
//       headers: {
//         "sessionKey": accessToken
//       }
//     };

//     let self = curPage;

//     APICaller.get("login/confirmToken", header,
//       function (res) {
//         console.log(JSON.stringify(res));
//         if (res.status != 200) {
//           console.log("res confirmToken " + res.status);
//           self.$cookies.remove("ACCESS_TOKEN");
//           window.location.href = "/#/google-login";
//           return;
//         }

//         console.log('path + ' + curPage.$route.fullPath);
//         callback && callback();
//         // !curPage || (window.location.href = '/#' + curPage.$route.fullPath);
//       },
//       function (error) {
//         console.log(error.message);
//         self.$cookies.remove("ACCESS_TOKEN");
//         window.location.href = "/#/google-login";
//       }
//     );
//   }


//   getUserInfo(curPage) {
//     let self = curPage;

//     let header = {
//       headers: {
//         "content-type": "application/json",
//         "sessionKey": self.$cookies.get("ACCESS_TOKEN")
//       }
//     };

//     APICaller.get('profile/getUserInfo', header,
//       function (res) {
//         if (res.data.errorCode == 100) {
//           self.$cookies.remove("ACCESS_TOKEN");
//           window.location.href = "/#/google-login";
//           return;
//         }

//         if (
//           !MemoryUtil.getGameId() ||
//           !res.data.permissions[MemoryUtil.getGameId()]
//         ) {
//           MemoryUtil.setGameId(Object.keys(res.data.permissions)[0]);
//         }

//         if (
//           !MemoryUtil.getGameMode() ||
//           !res.data.permissions[MemoryUtil.getGameId()][
//             MemoryUtil.getGameMode()
//           ]
//         ) {
//           MemoryUtil.setGameMode(
//             Object.keys(
//               res.data.permissions[MemoryUtil.getGameId()]
//             )[0]
//           );
//         }

//         MemoryUtil.setGameIds(JSON.stringify(Object.keys(res.data.permissions)));

//         console.log("userProfile in UserProfile.vue " + JSON.stringify(res.data));
//         window.location.href = "/#/user-profile";
//       },

//       function (error) {
//         console.error(error);
//         self.$cookies.remove("ACCESS_TOKEN");
//         window.location.href = "/#/google-login";
//       }
//     );
//   }

//   getMetadata(curPage, callback) {
//     let self = curPage;

//     let header = {
//       "content-type": "application/json",
//       sessionKey: self.$cookies.get("ACCESS_TOKEN")
//     };
//     let body = {
//       gameId: MemoryUtil.getGameId(),
//       mode: MemoryUtil.getGameMode()
//     };
//     APICaller.getWithParams(
//       "getMetadata",
//       header,
//       body,
//       function (res) {
//         // console.log(res);
//         if (res.status != 200) {
//           self.$cookies.remove("ACCESS_TOKEN");
//           window.location.href = "/#/google-login";
//           return;
//         }
//         MetadataUtils.setGameMetadata(res.data);

//         if (MetadataUtils.isModuleEnable("FetchMetadata")) {
//           this.getMetadataRemotely(curPage, callback);
//         }
//         EventBus.$emit('metadata-updated');
//         callback && callback();
//       }.bind(this),
//       function (error) {
//         console.log(error);
//         self.$cookies.remove("ACCESS_TOKEN");
//         window.location.href = "/#/google-login";
//       }
//     );
//   }
//   getMetadataRemotely(curPage, callback) {
//     let self = curPage;

//     let header = {
//       "content-type": "application/json",
//       sessionKey: self.$cookies.get("ACCESS_TOKEN")
//     };
//     let body = {
//       gameId: MemoryUtil.getGameId(),
//       mode: MemoryUtil.getGameMode()
//     };
//     APICaller.getWithParams(
//       "getMetadata/remote",
//       header,
//       body,
//       function (res) {
//         MetadataUtils.mergeGameMetadata(res.data.retData.jsonData);
//         callback && callback();
//         EventBus.$emit('metadata-updated');
//       },
//       function (error) {
//         console.log(error);
//       }
//     );
//   }
//   checkConnection(curPage, successCallback, errorCallback) {
//     let self = curPage;

//     let header = {
//       "content-type": "application/json",
//       sessionKey: self.$cookies.get("ACCESS_TOKEN")
//     };
//     let body = {
//       gameId: MemoryUtil.getGameId(),
//       mode: MemoryUtil.getGameMode()
//     };
//     APICaller.getWithParams(
//       "getMetadata/checkConnection",
//       header,
//       body,
//       successCallback,
//       errorCallback
//     );
//   }
// }

// let instance = new HandlerCheckSession();
// export default instance;
