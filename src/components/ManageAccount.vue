<template>
  <div>
    <Navigation :isVisibleNotify="isVisibleNoti" :text="notiText" :state="notiState"></Navigation>
    <div style="width: 98%;float: left">
      <!-- <p class="title has-text-centered mt-100" style="width: 100%;  height: 0px;float: left"></p> -->
      <button @click="filterAccount()" class="button is-primary mb-2" style="float: right">Tìm kiếm</button>
      <input class="input is-primary is-medium" v-model="search" @keydown.enter="filterAccount"
        style="float: right;width: 10%; height: 40px" />
    </div>

    <div class="columns mt-10" style="width: 100%; float: left">
      <table class="table  is-bordered container is-fullwidth has-text-centered mt-3" style="font-size: 15px">
        <thead style="backgroundColor: #3298dc">
          <th>ID</th>
          <th>Email</th>
          <th>ROLE</th>
          <th>Update</th>
          <th>DELETE</th>
          <th><button class="button is-primary" @click="createAccount()">Create </button></th>
        </thead>
        <tbody>
          <tr v-for="account in listAccount" :key="account._id">
            <td>{{account._id}}</td>
            <td> {{account.email}}</td>
            <td> {{AccountRole[account.role].title}}
            </td>
            <td><button class="button is-primary" @click="update(account)">Cập nhật </button></td>
            <td><button class="button is-danger" @click="deleteAccount(account._id)"> Xóa </button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal is-active" v-if="isCreate">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Tạo mới account</p>
          <button class="delete" aria-label="close" @click="isCreate = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="createAccount ">
            <table class="table is-bordered container is-fullwidth has-text-centered mt-3" style="font-size: 15px">
              <thead>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
              </thead>
              <tbody>
                <tr>
                  <td><input class="has-text-centered" style="width: 200px; height: 50px;" placeholder="Email"
                      v-model="accountCreated.email" /></td>
                  <td><input class="has-text-centered" style="width: 200px; height: 50px;" placeholder="Password"
                      v-model="accountCreated.password" /></td>
                  <td>
                    <DropDown style="border: none" class="mt-3" :type="ObjectConst.DROP_DOWN.ROLE"
                      :title="AccountRole[role].title" :items="AccountRole" :id="accountCreated._id"
                      @clicked="onClickChildCreated"></DropDown>
                    <!-- <DropDown style="width: 130px; height: 50px; text-align: center"  :type="ObjectConst.DROP_DOWN.ROLE" 
                      :title="AccountRole[accountUpdate.role].title" :items="AccountRole"
                :id="accountUpdate._id" @clicked="onClickChild"> </DropDown> -->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <footer class="modal-card-foot" style="text-align: justify">
          <button class="button is-success" @click="onCreateAccount(accountCreated)">Tạo</button>
          <button class="button" @click="isCreate = false">Hủy</button>
        </footer>
      </div>
    </div>
    <div class="modal is-active" v-if="isUpdate">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Cập nhật account</p>
          <button class="delete" aria-label="close" @click="isUpdate = false"></button>
        </header>
        <section class="modal-card-body" style="width:100%">
          <div>
            <table class="table is-bordered container is-fullwidth has-text-centered mt-3" style="font-size: 15px">
              <thead>
                <th>ID</th>
                <th>Email</th>
                <th>ROLE</th>
                <th>Password</th>
                <th>Confirm Password</th>
              </thead>
              <tbody style="width: 1000px">
                <tr>
                  <td style="width: 100px; height: 50px;font-size: 10px">{{accountUpdate._id}}</td>
                  <td>{{accountUpdate.email}}</td>
                  <td>
                    <DropDown class="mt-2" style="text-align: center;border: none"
                      :type="ObjectConst.DROP_DOWN.ROLE" :title="AccountRole[accountUpdate.role].title"
                      :items="AccountRole" :id="accountUpdate._id" @clicked="onClickChild"> </DropDown>
                  </td>
                  <td><input placeholder="password" type="password" style="width: 120px; height: 40px;"
                      v-model="accountUpdate.password" /> </td>
                  <td><input placeholder="confirm password" type="password" style="width: 130px; height: 40px;"
                      v-model="accountUpdate.confirmPassword" /> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <footer class="modal-card-foot" style="text-align: justify">
          <button class="button is-success" @click="updateAccount(accountUpdate)">Cập nhật</button>
          <button class="button" @click="isUpdate = false">Hủy</button>
        </footer>
      </div>
    </div>
    <Modal :isVisible.sync="modalAlert_isVisible" :title="modalAlert_title" :cbApprove="modalAlert_cbApprove"
      :cbCancle="modalAlert_cbCancle"></Modal>
  </div>
</template>

<script>
  import Navigation from './Navigation'
  import APICaller from '../network/APICaller';
  import GameData from '../Utility/GameData';
  import ACCOUNT_ROLE from '../const/role_const';
  import router from '../router';
  import lodash from 'lodash';
  import DropDown from '../components/DropDown';
  import OBJECT_CONST from '../const/object_const';
  import Utils from '../Utility/Utils';
  import Modal from './Modal';
  import Notification from './Notification';
  import ERROR_CODE from '../const/error_code';
  var md5 = require('md5');

  export default {
    name: 'ManageAccount',
    components: {
      Navigation,
      DropDown,
      Modal,
      Notification
    },

    data() {
      return {
        listAccount: Array(),
        AccountRole: ACCOUNT_ROLE,
        isUpdate: false,
        ObjectConst: OBJECT_CONST,
        isCreate: false,
        accountCreated: Object(),
        modalAlert_isVisible: false,
        modalAlert_title: "",
        modalAlert_cbApprove: "",
        modalAlert_cbCancle: "",
        notiText: "",
        notiState: "primary",
        isVisibleNoti: false,
        staticListAccount: Array(),
        role: 2,
        search: ''
      }
    },

    mounted() {
      if (!(GameData.getRoleAccount() == ACCOUNT_ROLE[0].id)) {
        router.push('ObjectGroup');
        return;
      }
      this.handleFinishCreateOrUpdate();
      this.getListAccounts();
      this.accountCreated.role = 2;
    },

    methods: {
      getListAccounts() {
        let header = {
          headers: {
            "content-type": "application/json",
          },
          params: {
            gameId: GameData.getGameId()
          }
        };

        APICaller.get(
          "accounts_route/list",
          header,
          function (res) {
            this.listAccount = res.data.data.sort(function (o1, o2) {
              return o1.role - o2.role;
            });
            for (let i in this.listAccount) {
              this.listAccount[i].roleName = ACCOUNT_ROLE[this.listAccount[i].role].title;
            }
            this.staticListAccount = JSON.parse(JSON.stringify(this.listAccount));
          }.bind(this),
          function (error) {
            console.log(error);
          },
          function (a, b, c) {
            this.isVisibleNoti = a;
            this.notiText = b;
            this.notiState = c;
          }.bind(this)
        );
      },

      updateAccount(account) {
        if (account.confirmPassword == null || account.confirmPassword.length <= 0 ||
          account.confirmPassword != account.password) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Confirm Password không hợp lệ!";
          this.notiState = "danger";
          return;
        }

        let body = {
          id: account._id,
          dataModify: {
            // email: account.email,
            role: account.role,
            password: account.password
          }
        }
        console.log("updateAccount ", body, account);

        for (let i in account) {
          if (account[i] == null || account[i].length == 0) {
            this.isVisibleNoti = Math.round(+new Date() / 1000);
            this.notiText = "Vui lòng điền hết thông tin!";
            this.notiState = "danger";
            return;
          }
        }

        let oldAcc = this.staticListAccount.find(v => v._id == account._id);
        if (!Utils.checkDuplicateData(oldAcc, account) || oldAcc.password == md5(account.password)) {
          this.isVisibleNoti = Math.round(+new Date() / 1000);
          this.notiText = "Dữ liệu cập nhật không đổi";
          this.notiState = "danger";
          return;
        }
        this.modalAlert_isVisible = true;
        var updateAccountCB = function () {
          this.isUpdate = false;
          this.modalAlert_isVisible = false;
          let header = {
            headers: {
              "content-type": "application/json",
            },
            params: {
              gameId: GameData.getGameId()
            }
          };

          APICaller.post(
            "accounts_route/edit",
            header,
            body,
            function (res) {
              if (res.data.errorCode == ERROR_CODE.SUCCESS) {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Cập nhật thành công!";
                this.notiState = "success";
                this.listAccount.splice(this.listAccount.findIndex(v => v._id == account._id), 1, res.data.data);
                this.staticListAccount = JSON.parse(JSON.stringify(this.listAccount));
              } else {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Cập nhật thất bại! errorCode: " + res.data.errorCode;
                this.notiState = "danger";
              }

            }.bind(this),
            function (error) {
              console.log(error);
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "update account fail; errorCode: " + error;
              this.notiState = "danger";
            }.bind(this),
            function (a, b, c) {
              this.isVisibleNoti = a;
              this.notiText = b;
              this.notiState = c;
            }.bind(this)
          );
        }
        this.updateDataModalAlert("Bạn có muốn cập nhật?", updateAccountCB.bind(this));
      },

      deleteAccount(idAccount) {
        this.modalAlert_isVisible = true;
        console.log("deleteAccount ", idAccount);
        var deleteAccountCallBack = function () {
          this.modalAlert_isVisible = false;
          let header = {
            headers: {
              "content-type": "application/json",
            },
            params: {
              gameId: GameData.getGameId()
            }
          };

          let body = {
            idAccount: idAccount
          }

          APICaller.post(
            "accounts_route/delete",
            header,
            body,
            function (res) {
              if (res.data.errorCode == ERROR_CODE.SUCCESS) {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Xóa thành công!";
                this.notiState = "success";
                this.listAccount.splice(this.listAccount.findIndex(v => v._id == idAccount), 1);
                this.handleFinishCreateOrUpdate();
              } else {
                this.isVisibleNoti = Math.round(+new Date() / 1000);
                this.notiText = "Xóa thất bại!errorCode: " + res.data.errorCode;
                this.notiState = "danger";
              }

            }.bind(this),
            function (error) {
              console.log(error);
              this.handleFinishCreateOrUpdate();
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "delete account fail; errorCode: " + error;
              this.notiState = "danger";
            }.bind(this),
            function (a, b, c) {
              this.isVisibleNoti = a;
              this.notiText = b;
              this.notiState = c;
            }.bind(this)
          );
        };
        this.updateDataModalAlert("Bạn có muốn xóa không?", deleteAccountCallBack.bind(this));
      },

      onClickChild(item) {
        for (let i in this.listAccount) {
          if (this.listAccount[i]._id == item.idOption) {
            this.listAccount[i].role = item.id;
          }
        }
      },

      createAccount() {
        this.isCreate = true;
      },

      onClickChildCreated(item) {
        this.role = item.id
        console.log(item);
        this.accountCreated.role = item.id;
        console.log("onClickChildCreated ", this.accountCreated.role);
      },

      onCreateAccount(account) {
        console.log("acc", account)
        for (let i in account) {
          if (account[i] == null || account[i].length == 0) {
            this.isVisibleNoti = Math.round(+new Date() / 1000);
            this.notiText = "Vui lòng điền hết thông tin!";
            this.notiState = "danger";
            return;
          }
        }
        let header = {
          headers: {
            "content-type": "application/json",
          },
          params: {
            gameId: GameData.getGameId()
          }
        };

        APICaller.post(
          "accounts_route/add",
          header,
          account,
          function (res) {
            if (res.data.errorCode == ERROR_CODE.SUCCESS) {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Tạo tài khoản thành công!";
              this.notiState = "success";
              console.log("res ", res.data.data);
              this.listAccount.unshift(res.data.data);
              this.handleFinishCreateOrUpdate();
            } else {
              this.isVisibleNoti = Math.round(+new Date() / 1000);
              this.notiText = "Tạo tài khoản thất bại!errorCode: " + res.data.errorCode;
              this.notiState = "danger";
            }
            this.isCreate = false;
          }.bind(this),
          function (error) {
            console.log(error);
            this.handleFinishCreateOrUpdate();
            this.isVisibleNoti = Math.round(+new Date() / 1000);
            this.notiText = "create account fail; errorCode: " + error;
            this.notiState = "danger";
            this.isCreate = false;
          }.bind(this),
          function (a, b, c) {
            this.isVisibleNoti = a;
            this.notiText = b;
            this.notiState = c;
          }.bind(this)
        );
      },

      handleFinishCreateOrUpdate() {
        console.log("handleFinishCreateOrUpdate");
        this.isCreate = false;
        this.accountCreated.role = 2;
        this.accountCreated.email = "";
        this.accountCreated.password = "";
      },

      updateDataModalAlert(title, callBack) {
        this.modalAlert_isVisible = true;
        this.modalAlert_title = title;
        this.modalAlert_cbApprove = callBack;
        this.modalAlert_cbCancle = function () {
          this.modalAlert_isVisible = false;
        }.bind(this);
      },

      update(acc) {
        this.isUpdate = true;
        this.accountUpdate = acc;
      },

      filterAccount() {
        this.listAccount = this.listAccount.filter(item => {
          if (item._id.indexOf(this.search.toLowerCase()) > -1) {
            return item._id.indexOf(this.search.toLowerCase()) > -1
          } else {
            return item.email.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          }
        })
      }
    },

  }

</script>
<style scoped>
  .title {
    font-size: 15px;
  }

  tr:nth-child(even) {
    background-color: azure;
  }

  .modal-content,
  .modal-card {
    margin: 0 20px;
    max-height: calc(100vh - 160px);
    overflow: auto;
    position: relative;
    width: 100%;
  }

  @media screen and (min-width: 769px) {

    .modal-content,
    .modal-card {
      margin: 0 auto;
      max-height: calc(100vh - 40px);
      width: 960px;
    }
  }

</style>
