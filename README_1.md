### SETUP

$ npm install

### RUN
$ npm run dev

### BUILD
* $ npm run build
* copy static finder (dish finder) into server finder.

### LOGIN
* [adminFrontend]/src/pages/GoogleLogin.vue
* Login service:
  * [CONFIG] [adminFrontend]/src/config/Config.json , 
      [LINK] OAUTH_HOST.RELEASE: "https://admin-page-6c0d2.firebaseapp.com"
  * Lúc đăng nhập, client gửi kèm theo "state=" ... (xem ở 'googleURL' GoogleLogin.vue)
  * Khi đăng nhập thành công servicLogin sẽ gửi accessToken về...
* [SOURCE service login] dir [LoginRedirect]
  
* [NOTE] Để **TEST** ko cần login (cho máy deskdo ko có mạng}):
  * [CLIENT code] in file: [adminFrontend]'/src/pages/GoogleLogin.vue', 
    change "let mode = _MODE.RELEASE" to "let mode = _MODE.DEV"
  * [SERVER code] in file: [adminBackend]'/_service/UserInfoService.js', 
    change "this.mode = BUILD_MODE.RELEASE;" to "this.mode = BUILD_MODE.DEV;"
    
### CODE STRUCTURE:
- **src**
  - config 
  - network
  - util
  - pages
  - ...
  
    
    
    



