<template>
<div>
    <span class="fg_head">忘记密码</span>
    <el-form ref="form" :model="form" label-width="80px" class="fg_padd">
        <el-form-item label="邮箱地址">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验 证 码">
            <el-input v-model="form.code">
                <el-button slot="append" icon="message" :loading="sendLoad" placeholder="请输入验证码" @click="sendMail()">{{text}}</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="新 密 码">
            <el-input v-model="form.newpass" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="resetLoad">重置密码</el-button>
    </el-form>
</div>
</template>

<script>
export default {
    data: function() {
        return {
            form: {
                email: '',
                code: '',
                newpass: ''
            },
            api: 'http://118.89.159.95:10352/api/',
            sendLoad: false,
            time: 0,
            resetLoad: false
        }
    },
    methods: {
        onSubmit() {
            this.resetLoad = true;
            var qs = require('qs');
            this.$axios.post(this.api + 'reset_password', qs.stringify({
                email: this.form.email,
                confirmCode: this.form.code,
                newPassword: this.form.newpass
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                if (response.data.code != 200) {
                    this.$message({
                        type: 'error',
                        message: response.data.msg
                    });
                } else if (response.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: "重置密码成功"
                    });
                    this.$router.push('/readme');
                }
            })
            this.resetLoad = false;
        },
        sendToMail() {
            var qs = require('qs');
            this.$axios.post(this.api + 'forget_password', qs.stringify({
                email: this.form.email
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                if (response.data.code != 200) {
                    this.$message({
                        type: 'error',
                        message: response.data.msg
                    });
                } else if (response.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: "验证码已发送到邮箱"
                    });
                }
            })
        },
        sendMail() {
            if (this.form.email == "") {
                this.$message({
                    type: 'error',
                    message: '请填写邮箱'
                });
                return;
            }
            this.sendLoad = true;
            this.time = 60;
            this.timer();
            this.sendToMail();
        },
        timer() {
            if (this.time > 0) {
                this.time--;
                setTimeout(this.timer, 1000);
            }
        }
    },
    computed: {
        text: function() {
            if (this.time == 0) {
                this.sendLoad = false;
            }
            return this.time > 0 ? this.time + 's 后重新获取' : '获取验证码';
        }
    }
}
</script>

<style scoped>
@import "../css/main.css";
@import "../css/color-dark.css";
.ms-doc {
    width: 100%;
    max-width: 980px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.fg_head {
    font-size: 30px;
    text-align: center;
    padding-bottom: 10px;
}

.fg_padd {
    padding-top: 10px;
    width: 400px;
}
</style>
