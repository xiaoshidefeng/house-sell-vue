<template>
<div class="header">
    <div class="logo">网上租房后台管理</div>
    <div class="user-info">
        <!-- <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link" @click="showLoginDia($event)">
                    {{username}}
                </span>
            <span class="el-dropdown-link" @click="showRegisterDia()">
                    {{regist}}
                </span>
        </el-dropdown> -->
        <!-- <div id="register">
            <el-dialog title="用户注册" :visible.sync="register" size="tiny">
                <el-form>
                    <el-form-item label="用户邮箱" :label-width="formLabelWidth">
                        <el-input v-model="email" auto-complete="off" placeholder="请输入邮箱"></el-input>
                    </el-form-item>

                    <el-form-item label="登录密码" :label-width="formLabelWidth">
                        <el-input v-model="password" type="password" auto-complete="off" placeholder="请输入密码"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="register = false;registLoad = false">取 消</el-button>
                    <el-button type="primary" @click="registerTo()" :loading="registLoad">注 册</el-button>
                </div>
            </el-dialog>
        </div>
        <div id="login">
            <el-dialog title="用户登录" :visible.sync="loginDi" size="tiny">
                <el-form>
                    <el-form-item label="用户邮箱" :label-width="formLabelWidth">
                        <el-input v-model="email" auto-complete="off" placeholder="请输入邮箱"></el-input>
                    </el-form-item>

                    <el-form-item label="登录密码" :label-width="formLabelWidth">
                        <el-input v-model="password" type="password" auto-complete="off" placeholder="请输入密码"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <a href="#" class="forgetpass" @click="forgetp">忘记密码</a>
                    <el-button @click="loginDi = false;loginLoad = false">取 消</el-button>
                    <el-button type="primary" @click="loginTo()" :loading="loginLoad">登 录</el-button>
                </div>
            </el-dialog>
        </div> -->
    </div>
</div>
</template>
<script>
import Bus from './js/bus.js';
export default {
    data() {
        return {
            api: 'http://118.89.159.95:10352/api/',
            username: '登录',
            regist: '注册',
            register: false,
            email: '',
            password: '',
            formLabelWidth: '100px',
            code: '',
            msg: '',
            registLoad: false,
            loginDi: false,
            loginLoad: false
        }
    },
    computed: {

    },
    created() {
        this.checkLogin();
    },
    methods: {
        checkLogin() {
            if (!this.getCookie('lowPowerName')) {
                this.username = '登录';
                this.regist = '注册';
            } else {
                this.username = this.getCookie('lowPowerName');
                this.regist = '';

            }
        },
        handleCommand(command) {
            if (command == 'loginout') {

            }
        },
        forgetp() {
            this.loginDi = false;
            this.$route.path.replace('/binddorm', '');
            this.$route.path.replace('/readme', '');
            this.$route.path.replace('/lowpower', '');
            this.$route.path.replace('/forget_password', '');
            this.$router.push('/forget_password');
        },
        showRegisterDia() {
            this.register = true;
        },
        registerTo() {
            this.registLoad = true;
            var qs = require('qs');
            this.$axios.post(this.api + 'register', qs.stringify({
                userEmail: this.email,
                password: this.password
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                this.code = response.data.code;
                this.msg = response.data.msg;
                if (this.code != 200) {
                    this.$message({
                        type: 'error',
                        message: this.msg
                    });
                } else if (this.code == 200) {
                    this.$message({
                        type: 'success',
                        message: "注册信息已提交，请注意查收验证邮件"
                    });
                    this.register = false;
                }
                this.registLoad = false;

            })
        },
        showLoginDia(event) {
            if (this.username == '登录') {
                this.loginDi = true;
            } else {
                this.logoutTo();
            }

        },
        loginTo() {
            this.loginLoad = true;
            var qs = require('qs');
            this.$axios.post(this.api + 'login', qs.stringify({
                userEmail: this.email,
                password: this.password
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                this.code = response.data.code;
                this.msg = response.data.msg;
                if (this.code != 200) {
                    this.$message({
                        type: 'error',
                        message: this.msg
                    });
                } else if (this.code == 200) {
                    this.$router.push('/binddorm');
                    this.$message({
                        type: 'success',
                        message: "登录成功"
                    });
                    this.username = this.email;
                    this.regist = '';
                    this.loginDi = false;
                    //TODO 保存用户信息，刷新时不要重新登录
                    //如果登录成功则保存登录状态并设置有效期
                    let expireDays = 1000 * 60 * 60 * 24 * 15;
                    this.setCookie('lowPowerToken', response.data.data.userToken, expireDays);
                    this.setCookie('lowPowerName', this.email, expireDays);
                    this.setCookie('lowPowerFloor', response.data.data.floor, expireDays);
                    this.setCookie('lowPowerDorm', response.data.data.dorm, expireDays);

                    Bus.$emit('login', event.target);
                }
                this.loginLoad = false;
            })
        },
        logoutTo() {
            this.$confirm('此操作将退出登录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //TODO 删除用户信息
                this.delCookie('lowPowerToken');
                this.delCookie('lowPowerName');
                this.delCookie('lowPowerFloor');
                this.delCookie('lowPowerDorm');
                this.username = '登录';
                this.regist = '注册';
                Bus.$emit('logout', event.target);
                this.$route.path.replace('/binddorm', '');
                this.$router.push('/readme');
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消退出登录'
                });
            });

        }
    }
}
</script>
<style scoped>
@import "../css/main.css";
@import "../css/color-dark.css";
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
}

.header .logo {
    float: left;
    width: 250px;
    text-align: center;
}

.user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
}

.user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}

.user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-menu__item {
    text-align: center;
}

.forgetpass {
    font-size: 10px;
    text-align: right;
    padding-right: 10px;
}

.a {
    color: #000;
}
</style>
