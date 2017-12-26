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
              width="180">
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
    </div>
</template>

<script>
    export default {
        data() {
            return {
                api: 'http://localhost:8888/api',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_area: '',  //选择东西区
                select_floor: '东区1号楼',  //选择楼号
                select_word: '',
                del_list: [],
                is_search: false,
                order: ''
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
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
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
