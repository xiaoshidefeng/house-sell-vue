<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
                <el-breadcrumb-item>订单表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>




        <!-- <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="house_name" label="楼幢号" sortable width="200">
            </el-table-column>
            <el-table-column prop="user_name" label="房间号" sortable width="200">
            </el-table-column>
            <el-table-column prop="house_price" label="价格" sortable width="200">
            </el-table-column>
            <el-table-column prop="creat_time" label="订单时间" width="200">
            </el-table-column>
            <el-table-column prop="order_complete" label="订单状态" width="200">
                <span v-if="order_complete">完成</span>
            </el-table-column>
            <el-table-column label="备注" :formatter="formatter">
            </el-table-column>
        </el-table> -->

            <el-table
            :data="order"
            style="width: 100%">
            <el-table-column
            label="订单创建日期"
            width="200">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.creat_time }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="房屋名称"
            width="160"
            prop="house_name">
            </el-table-column>
            <el-table-column
            label="价格(元)"
            width="120"
            prop="house_price">
            </el-table-column>
            <el-table-column
            label="购买者"
            width="120"
            prop="user_name">
            </el-table-column>
            <el-table-column
              label="订单状态"
              width="100">
              <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                      <el-tag type="success" size="medium" v-if="scope.row.order_complete">已完成</el-tag>
                      <el-tag type="danger" size="medium" v-else>未完成</el-tag>
                  </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)" v-if="!scope.row.order_complete">修改订单</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)" v-if="!scope.row.order_complete">取消订单</el-button>
            </template>
            </el-table-column>
        </el-table>

          <el-dialog title="编辑订单" :visible.sync="editDia">
            <el-form >
            <el-form-item label="创建时间" :label-width="formLabelWidth">
                <el-input v-model="ctime" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="房屋价格" :label-width="formLabelWidth">
                <el-input v-model="price" auto-complete="off" type="number"></el-input>
            </el-form-item>
            <el-form-item label="是否完成" :label-width="formLabelWidth">
                <el-switch
                v-model="complete">
                </el-switch>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="editDia = false">取 消</el-button>
            <el-button type="primary" @click="toUpdate()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                api: 'http://localhost:8888/api',
                order: '',
                ctime: '',
                price: 0,
                complete: false,
                editDia: false,
                order_id: '',
                formLabelWidth: '300'

            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                    let is_del = false;
                    for (let i = 0; i < self.del_list.length; i++) {
                        if(d.name === self.del_list[i].name){
                            is_del = true;
                            break;
                        }
                    }
                    if(!is_del){
                        if(d.house_name.indexOf(self.select_floor) > -1 &&
                            (d.house_name.indexOf(self.select_word) > -1 ||
                            d.dormNum.indexOf(self.select_word) > -1)
                        ){
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                  self.$axios.get(self.api + '/orders').then((response) => {
                      console.log(response.data.data);
                    self.order = response.data.data;
                  })

            },
            search(){
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.price = row.house_price;
                this.ctime = row.creat_time;
                this.complete = row.order_complete;
                this.order_id = row.order_id;
                this.editDia = true;
            },
            handleDelete(index, row) {
            console.log(index, row.order_id);

            var qs = require('qs');
                this.$axios.post(this.api + '/deleteOrder', qs.stringify({
                order_id: row.order_id
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(response => {
                console.log(response);
                if (response.data.code == 200) {
                    this.showSuccessMsg('取消订单成功');
                    // row.order_complete.$set(true);
                    // this.$set(this.order, index, true)
                } else {
                    this.showErrorMsg(response.data.msg);
                }
                this.getData();
                })
            },
            toUpdate() {
                var qs = require('qs');
                this.$axios.post(this.api + '/updateOrder', qs.stringify({
                order_id: this.order_id,
                order_complete: this.complete,
                house_price: this.price,
                creat_time: this.ctime
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(response => {
                console.log(response);
                if (response.data.code == 200) {
                    this.showSuccessMsg('修改订单成功');
                    // row.order_complete.$set(true);
                    // this.$set(this.order, index, true)
                } else {
                    this.showErrorMsg(response.data.msg);
                }
                this.getData();
                })
                this.editDia = false;
            },
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
            }
        }
    }
</script>

<style scoped>
@import "../css/main.css";
@import "../css/color-dark.css";
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>
