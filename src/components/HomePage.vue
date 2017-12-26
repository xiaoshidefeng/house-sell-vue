<template>
    <div class="container-fluid">
      <div class="row clearfix">
        <div class="col-md-12 column">
          <nav class="navbar navbar-default" role="navigation">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
              <a class="navbar-brand" href="#/">网上租房</a>
            </div>
  
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <el-form class="navbar-form navbar-left">
                <div class="form-group">
                  <input placeholder="请输入房屋名称" class="form-control" v-model="findHouse" @keyup.enter="searchHouse">
                </div> 
                <el-button type="primary" icon="el-icon-search" @click="searchHouse()">查找房屋</el-button>
              </el-form>
              <ul class="nav navbar-nav navbar-right" v-show="!isLogin">
                <li>
                  <a @click="loginDia = true">登 录</a>
                </li>
                <li>
                  <a @click="register = true">注 册</a>
                </li>
              </ul>
              <ul class="nav navbar-nav navbar-right" v-show="isLogin">
                <li>
                  <a href="#/order">我的订单</a>
                </li>
                <li>
                  <a href="#/myhouse">我的房屋</a>
                </li>
                <li class="dropdown">
							    <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{userName}}<strong class="caret"></strong></a>
                  <ul class="dropdown-menu">
                    <li>
                      <a href="#">个人信息</a>
                    </li>
                    <li>
                        <a href="#/readme" v-if="admin">后台管理</a>
                    </li>
                    <li class="divider">
                    </li>
                    <li>
                      <a href="#" @click="logout()">退出登录</a>
                    </li>
							    </ul>
						    </li>
              </ul>
            </div>
  
          </nav>
  
          <div class="jumbotron">
            <h1>
              网上租房系统
            </h1>
            <p>
              网上租房系统是房地产家居行业专业网络平台<br>
              一直专注新房、二手房、租房等领域的互联网创新，在房地产互联网移动及PC均处于行业前列
            </p>
            <p>
              <!-- <a class="btn btn-primary btn-large" href="#">了解更多</a> -->
              <el-button type="primary" round>了解更多</el-button>
            </p>
          </div>
        </div>
      </div>
  
  
      <!-- 注册 遮罩窗体 -->
      <div id="register">
          <el-dialog title="用户注册" :visible.sync="register" size="tiny">
              <el-form>
                  <el-form-item label="用 户 名">
                      <el-input v-model="name" auto-complete="off" placeholder="请输入邮箱"></el-input>
                  </el-form-item>
  
                  <el-form-item label="登录密码" >
                      <el-input v-model="password" type="password" auto-complete="off" placeholder="请输入密码"></el-input>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="register = false;registLoad = false">取 消</el-button>
                  <el-button type="primary" @click="registerTo()" :loading="registLoad">注 册</el-button>
              </div>
          </el-dialog>
      </div>
      <!-- 遮罩窗体结束 -->
  
      <!-- 登录 遮罩窗体 -->
      <div id="login">
          <el-dialog title="用户登录" :visible.sync="loginDia" size="tiny">
              <el-form>
                  <el-form-item label="用 户 名">
                      <el-input v-model="name" auto-complete="off" placeholder="请输入邮箱"></el-input>
                  </el-form-item>
  
                  <el-form-item label="登录密码">
                      <el-input v-model="password" type="password" auto-complete="off" placeholder="请输入密码"></el-input>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <!-- <a href="#" class="forgetpass" @click="forgetp">忘记密码</a> -->
                  <el-button @click="loginDia = false;loginLoad = false">取 消</el-button>
                  <el-button type="primary" @click="loginTo()" :loading="loginLoad">登 录</el-button>
              </div>
          </el-dialog>
      </div>
      <!-- 遮罩窗体结束 -->
  
      
      <div class="row clearfix">
          <div class="col-md-4 column" v-for="house in houses">
            <!-- <img alt="140x140" src="static/img/1.png" /> -->
              <h2>
                  {{house.house_name}}
              </h2>
              <span>
                  {{house.house_desc}}
        </span><br>
        <span>
          {{house.house_address}}
        </span><br>
        <span>
          {{house.house_size}}
        </span><br>
        <span>
          {{house.house_prices}} 元/月
        </span><br>
              <p>
                   <a class="btn" :href="'#/house/' + house.house_id">查看详细 »</a>
              </p>
          </div>
      </div>
    
  </div>
</template>

<script>
  export default {
    name: 'HomePage',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        api: 'http://localhost:8888/api',
        houses: [],
        isLogin: false,
        userName: '',
        register: false,
        registLoad: false,
        name: '',
        password: '',
        loginDia: false,
        loginLoad: false,
        findHouse: '',
        admin: false
        // formLabelWidth: 300
      }
    },
    created() {
      // this.saveLoginData('sdas', 'dsadas', 'sdadada');
      this.getHouseList();
    },
    methods: {
      getHouseList() {
        if (this.getCookie('token')) {
          this.isLogin = true;
          this.userName = this.getCookie('username');
          if (this.getCookie('admin') == 'true') {
            this.admin = true;
          } else {
            this.admin = false;
          }      
        }
        
        this.$axios.get(this.api + '/house_sell').then((response) => {
          this.houses = response.data.data;
        })
      },
      registerTo() {
        this.registLoad = true;
        var qs = require('qs');
        this.$axios.post(this.api + '/register', qs.stringify({
          user_name: this.name,
          password: this.password
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
          console.log(response);
          var code = response.data.code;
          this.registLoad = false;
          if (code == 200) {
            this.showSuccessMsg('注册成功')
            this.register = false;
          } else {
            this.showErrorMsg(response.data.msg);
          }
        })

      },
      loginTo() {
        this.loginLoad = true;
        var qs = require('qs');
        this.$axios.post(this.api + '/login', qs.stringify({
          user_name: this.name,
          password: this.password
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
          console.log(response);
          var code = response.data.code;
          var data = response.data.data;
          var token = data.token;
          var userid = data.user_id;
          this.loginLoad = false;
          if (code == 200) {
            this.showSuccessMsg('登录成功');
            this.saveLoginData(this.name, userid, token);
            this.userName = this.name;
            this.isLogin = true;
            this.loginDia = false;
            this.admin = data.admin;
            this.saveAdmin(data.admin);
          } else {
            this.showErrorMsg(response.data.msg);
          }

        })
      },
      searchHouse() {
        // console.log(this.api + '/houses' + this.findHouse);

        var qs = require('qs');
        this.$axios.post(this.api + '/houses', qs.stringify({
          name: this.findHouse,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
          console.log(response);
          if (response.data.code == 200) {
            this.houses = response.data.data;
            return;
          } else {
            this.showWarnMsg(response.data.msg);
          }
        })
      },
      logout() {
        this.delCookie('token');
        this.delCookie('userid');
        this.delCookie('username');
        this.delCookie('admin');
        this.isLogin = false;
        this.showSuccessMsg('退出登录成功');
      },
      showErrorMsg(msg) {
        this.$notify.error({
          title: '错误',
          message: msg
        });
      },
      showSuccessMsg(msg) {
        this.$notify({
          title: '成功',
          message: msg,
          position: 'bottom-right',
          type: 'success'
        });
      },
      showWarnMsg(msg) {
        this.$notify({
          title: '警告',
          message: msg,
          type: 'warning'
        });
      },
      saveLoginData(username, userid, token) {
        //TODO 保存用户信息，刷新时不要重新登录
        //如果登录成功则保存登录状态并设置有效期
        let expireDays = 1000 * 60 * 60 * 24 * 15;
        this.setCookie('token', token);
        this.setCookie('userid', userid);
        this.setCookie('username', username);
      },
      saveAdmin(admin) {
        let expireDays = 1000 * 60 * 60 * 24 * 15;
        this.setCookie('admin', admin);
      },
      getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
          return unescape(arr[2]);
        else
          return null;
      },
      delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
          document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}*/
  /*a {
  color: #42b983;
}*/

  span {
    padding-left: 10px;
  }


  .container-fluid {
    /*margin-top: -15px;
  padding-top: -15px;*/
    /*margin-left: -50*/
    /*overflow-y: scroll;*/
  }

  .col-md-12.column {
    padding: 0px;
  }
</style>
