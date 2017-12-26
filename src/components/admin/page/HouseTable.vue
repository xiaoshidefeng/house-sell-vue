<template>
<div>
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-date"></i> 绑定</el-breadcrumb-item>
            <el-breadcrumb-item>绑定宿舍</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="ms-doc">
        <h3>绑定说明</h3>
        <article>
            <p>在寝室楼中选择对应的寝室</p>
            <p>在宿舍号中填写对应的宿舍号（须按要求填写，否则不能准确获得低电推送）</p>
            <p>宿舍号格式如下：</p>
            <p>楼号-寝室号</p>
            <p>例如：东区1幢101寝室，填写1-101即可（东西区不用填写）</p>
            <br></br>
            <p>部分特殊寝室号说明：</p>
            <p>东区15幢寝室分为A B两个部分，填写格式为：</p>
            <p>寝室号+A或B</p>
            <p>例如：东区15幢101寝室A，填写101A即可（不需要填写15-）</p>
            <br>
            <p>西区老9幢带k的寝室要填上对应的k</p>
            <p>例如：9-101k</p>
        </article>
    </div>
    <br>

    <br>
    <div class="form-box">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="宿舍号：">
                <el-input v-model="form.dormName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="bindingLoad" :disabled="submit">绑定寝室</el-button>
                <el-button @click="cancelBind" :disabled="cancel" :loading="cancelBindingLoad">取消绑定</el-button>
            </el-form-item>
        </el-form>
    </div>

</div>
</template>

<script>
import Bus from '../common/js/bus.js';

export default {
    data: function() {
        return {
            form: {
                dormName: '',
                region: '',
                date1: '',
                date2: '',
                checked: false,
                delivery: true,
                desc: ''
            },
            api: 'http://118.89.159.95:10352/api/',
            token: '',
            bindingLoad: false,
            select_floor: '东区1号楼',
            submit: false,
            cancel: false,
            cancelBindingLoad: false
        }
    },
    created() {
      this.getData();
    },
    methods: {
        getData() {
          let floor = this.getCookie('lowPowerFloor');
          let dorm = this.getCookie('lowPowerDorm');
          if (floor != 'not_set' && floor) {
            this.select_floor = floor;
            this.form.dormName = dorm;
            this.submit = true;
          }
        },
        onSubmit() {
            this.bindingLoad = true;
            this.token = this.getCookie('lowPowerToken');
            var qs = require('qs');
            this.$axios.post(this.api + 'bindingDorm', qs.stringify({
                dorm: this.form.dormName,
                token: this.token,
                floor: this.select_floor

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
                        message: this.form.dormName + "寝室绑定成功"
                    });
                    this.submit = true;
                    this.cancel = false;

                    let expireDays = 1000 * 60 * 60 * 24 * 15;
                    this.setCookie('lowPowerFloor', this.select_floor, expireDays);
                    this.setCookie('lowPowerDorm', this.form.dormName, expireDays);
                }
                this.bindingLoad = false;
            })
        },
        cancelBind() {
          this.cancelBindingLoad = true;
          this.token = this.getCookie('lowPowerToken');
          var qs = require('qs');
          this.$axios.post(this.api + 'cancel_binding', qs.stringify({
              token: this.token,
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
                      message: this.form.dormName + "取消绑定成功"
                  });
                  this.submit = false;
                  this.cancel = true;
                  this.form.dormName = '';
                  this.select_floor = '';
                  this.delCookie('lowPowerFloor');
                  this.delCookie('lowPowerDorm');
              }
              this.cancelBindingLoad = false;
          })
        }
    }
}
</script>

<style>
@import "../css/main.css";
@import "../css/color-dark.css";
</style>
