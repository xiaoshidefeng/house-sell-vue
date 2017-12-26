<template>
    <div class="container-fluid">
      <div class="row clearfix">
        <div class="col-md-12 column">
          <nav class="navbar navbar-default" role="navigation">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
              <a class="navbar-brand" href="#/">网上租房</a>
            </div>
				
				<!-- <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<form class="navbar-form navbar-left" role="search">
						<div class="form-group">
							<input type="text" class="form-control" />
						</div> <button type="submit" class="btn btn-default">Submit</button>
					</form> -->
				<!-- </div>	 -->
			</nav>
		</div>
	</div>

            <!-- <el-dialog
                title="付款信息确认"
                :visible.sync="buyDia"
                width="30%"
                center>
                <span>是否付款</span>
                <p>
                    {{this.house.house_name}} <br>  
                    描述： {{this.house.house_desc}} <br> 
                    价格： {{this.house.house_prices}} 元/月
                </p>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="buyDia = false">取 消</el-button>
                    <el-button type="primary" @click="rentHouse()">租 房</el-button>
                </span>
            </el-dialog> -->

	<div class="row clearfix">
          <el-table
            :data="order"
            style="width: 100%">
            <el-table-column
            label="订单创建日期"
            width="233">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.creat_time }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="房屋名称"
            width="180"
            prop="house_name">
            </el-table-column>
            <el-table-column
            label="价格"
            width="180"
            prop="house_price">
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
                @click="handleEdit(scope.$index, scope.row)" v-if="!scope.row.order_complete">付款</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)" v-if="!scope.row.order_complete">取消订单</el-button>
            </template>
            </el-table-column>
        </el-table>
	</div>
</div>
</template>

<script>
export default {
  name: "hello",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      api: 'http://localhost:8888/api',
      order: '',
    };
  },
  created() {
    this.getUser();
    this.getMyOrderList();
  },
  methods: {
    getMyOrderList() {
      this.$axios
        .get(this.api + "/user_orders/" + this.getCookie("userid"))
        .then(response => {
          console.log(response.data);
          this.order = response.data.data;
        });
    },
    getUser() {
      if (this.getCookie("token")) {
        this.userName = this.getCookie("username");
      }
    },
    editHouse(house_name) {
      console.log(house_name);
    },
    handleEdit(index, row) {
      var qs = require('qs');
        this.$axios.post(this.api + '/payHouse', qs.stringify({
          user_id: row.user_id,
          house_id: row.house_id
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
          console.log(response);
          if (response.data.code == 200) {
              this.showSuccessMsg('付款成功');
              // row.order_complete.$set(true);
              // this.$set(this.order, index, true)
          } else {
              this.showErrorMsg(response.data.msg);
          }
          this.getMyOrderList();
        })
        // this.getMyOrderList();
      console.log(index, row.creat_time);
      
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
          this.getMyOrderList();
        })
    },
    showErrorMsg(msg) {
      this.$notify.error({
        title: '错误',
        message: msg
      });
    },
    showWarnMsg(msg) {
      this.$notify({
        title: '警告',
        message: msg,
        type: 'warning'
      });
    },
    showSuccessMsg(msg) {
      this.$notify({
        title: '成功',
        message: msg,
        position: 'bottom-right',
        type: 'success'
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.col-md-12.column {
  padding: 0px;
}
</style>
 