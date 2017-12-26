<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 自述</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="ms-doc">
            <h3>使用说明</h3>
            <article>
                <h1>低电查询与推送</h1>
                <h2>低电查询</h2>
                <p>点击左侧低电表格来进行低电查询</p>
                <h2>低电推送</h2>
                <p>注册用户账号并验证邮箱成功后，登录系统，绑定要推送的寝室号即可。</p>
                <p>推送会以邮件的形式发送低电通知到您的邮箱（注册邮箱）。</p>

                <h2>补充说明</h2>
                <p>目前仅支持丽水学院低电查询与推送。</p>
                <p>如果从没收到低电提醒邮件，请去邮箱的垃圾箱检查是否被系统判别为垃圾邮件了。</p>

                <p>本意是方便大家更好的获取低电信息，避免因未及时充值电费，造成不必要的损失。
                  自己租的服务器性能有限，希望大家不要做会损害服务器的事。</p>
            </article>
        </div>
        <el-button slot="append" icon="message"
                  @click="feedback()">意见反馈</el-button>
        <div id="feedback">
          <el-dialog title="意见反馈" :visible.sync="feedbackDia">
            <el-form >
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="textarea">
              </el-input>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="feedbackDia = false">取 消</el-button>
            <el-button type="primary" @click="backTo()" :loading="backLoad">反 馈</el-button>
          </div>
          </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
              api: 'http://118.89.159.95:10352/api/',
              feedbackDia: false,
              textarea: '',
              backLoad: false,
              email: ''
            }
        },
        methods: {
          feedback() {
            this.feedbackDia = true;
          },
          backTo() {
            this.backLoad = true;
            var myDate = new Date();
            var qs = require('qs');
            this.email = this.getCookie('lowPowerName');

            if(this.email == null || this.email == '') {
              this.$message({
                type: 'error',
                message: "未登录"
              });
            }else {
              this.$axios.post(this.api + 'feedback', qs.stringify({
                feedbackContent: this.textarea,
                feedbackTime: myDate,
                feedbackUser: this.email
              }),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).then(response => {
                if(response.data.code != 200) {
                  this.$message({
                    type: 'error',
                    message: response.data.msg
                  });
                }else if(response.data.code == 200){
                  this.$message({
                    type: 'success',
                    message: "意见反馈成功"
                  });
                  this.$router.push('/readme');
                }
              })
            }
            this.backLoad = false;
          }
        }
    }
</script>

<style scoped>
@import "../css/main.css";
@import "../css/color-dark.css";
    .ms-doc{
        width:100%;
        max-width: 980px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    .ms-doc h3{
        padding: 9px 10px 10px;
        margin: 0;
        font-size: 14px;
        line-height: 17px;
        background-color: #f5f5f5;
        border: 1px solid #d8d8d8;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
    }
    .ms-doc article{
        padding: 45px;
        word-wrap: break-word;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    .ms-doc article h1{
        font-size:32px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
    }
    .ms-doc article h2 {
        margin: 24px 0 16px;
        font-weight: 600;
        line-height: 1.25;
        padding-bottom: 7px;
        font-size: 24px;
        border-bottom: 1px solid #eee;
    }
    .ms-doc article p{
        margin-bottom: 15px;
        line-height: 1.5;
    }
    .ms-doc article .el-checkbox{
        margin-bottom: 5px;
    }
</style>
