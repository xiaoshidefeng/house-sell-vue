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
					<form class="navbar-form navbar-left" role="search">
						<!-- <div class="form-group">
							<input type="text" class="form-control" />
						</div>  -->
          <el-button class="btn btn-default" @click="addDia = true;">添加房子</el-button>
            
					</form>
					<ul class="nav navbar-nav navbar-right">
						<li>
							 <a href="#">Link</a>
						</li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{userName}}<strong class="caret"></strong></a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a href="#">个人信息</a>
                                </li>
                                <!-- <li class="divider">
                                </li> -->
                                <!-- <li>
                                <a href="#" @click="logout()">退出登录</a>
                                </li> -->
                            </ul>
                        </li>
					</ul>
				</div>
				
			</nav>
		</div>
	</div>

  <el-dialog title="编辑房屋" :visible.sync="editDia">
    <el-form >
      <el-form-item label="房屋名称" :label-width="formLabelWidth">
        {{hname}}
      </el-form-item>
      <el-form-item label="房屋描述" :label-width="formLabelWidth">
        <el-input v-model="desc" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="房屋地址" :label-width="formLabelWidth">
        <el-input v-model="address" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="房屋大小" :label-width="formLabelWidth">
        <el-input v-model="size" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="房屋价格" :label-width="formLabelWidth">
        <el-input v-model="price" auto-complete="off" type="number"></el-input>
      </el-form-item>
      <el-form-item label="出售" :label-width="formLabelWidth">
        <el-switch
          v-model="sell">
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editDia = false">取 消</el-button>
      <el-button type="primary" @click="toUpdate()">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog title="添加房屋" :visible.sync="addDia">
    <el-form >
      <el-form-item label="房屋名称" :label-width="formLabelWidth">
        <el-input v-model="hname" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="房屋描述" :label-width="formLabelWidth">
        <el-input v-model="desc" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="房屋地址" :label-width="formLabelWidth">
        <el-input v-model="address" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="房屋大小" :label-width="formLabelWidth">
        <el-input v-model="size" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="房屋价格" :label-width="formLabelWidth">
        <el-input v-model="price" auto-complete="off" type="number"></el-input>
      </el-form-item>
      <el-form-item label="出售" :label-width="formLabelWidth">
        <el-switch
          v-model="sell">
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addDia = false">取 消</el-button>
      <el-button type="primary" @click="toAdd()">确 定</el-button>
    </div>
  </el-dialog>

	<div class="row clearfix">
		<div class="col-md-4 column" v-for="house in houses">
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
        <span v-if="house.house_sell">
           正在出售
        </span>
        <span v-else>
           未在出售
        </span>
              <p>
                   <el-button type="primary" @click="editHouse(house)">编 辑</el-button>
              </p>
          </div>
      </div>
</div>
</template>

<script>
export default {
  name: "myhouse",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      api: "http://localhost:8888/api",
      houses: [],
      userName: "",
      editDia: false,
      hname: '',
      desc: '',
      address: '',
      size: '',
      price: 0,
      hid: '',
      formLabelWidth: '300',
      sell: false,
      addDia: false
      
    };
  },
  created() {
    this.getUser();
    this.getMyHouseList();
  },
  methods: {
    getMyHouseList() {
      this.$axios
        .get(this.api + "/userhouse/" + this.getCookie("userid"))
        .then(response => {
          this.houses = response.data.data;
        });
    },
    getUser() {
      if (this.getCookie("token")) {
        this.userName = this.getCookie("username");
      }
    },
    editHouse(house) {
      this.hname = house.house_name;
      this.desc = house.house_desc;
      this.address = house.house_address;
      this.size = house.house_size;
      this.price = house.house_prices;
      this.editDia = true;
      this.hid = house.house_id;
      this.sell = house.house_sell;
      console.log(house.house_name);
    },
    toUpdate() {
      var qs = require('qs');
        this.$axios.post(this.api + '/updateHouse', qs.stringify({
            house_prices : this.price,
            house_address: this.address,
            house_size   : this.size,
            house_desc   : this.desc,
            house_id: this.hid,
            house_sell: this.sell
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
          console.log(response);
          if (response.data.code == 200) {
              this.showSuccessMsg('更新成功');
              // row.order_complete.$set(true);
              // this.$set(this.order, index, true)
          } else {
              this.showErrorMsg(response.data.msg);
          }
          this.getMyOrderList();
        })
        // this.getMyOrderList();
      // console.log(index, row.creat_time);
      this.editDia = false;
    },
    toAdd() {
      var user_id = this.getCookie('userid');
      var qs = require('qs');
        this.$axios.post(this.api + '/addHouse', qs.stringify({
            house_name: this.hname,
            house_prices : this.price,
            house_address: this.address,
            house_size   : this.size,
            house_desc   : this.desc,
            house_sell: this.sell,
            user_id: user_id
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
          console.log(response);
          if (response.data.code == 200) {
              this.showSuccessMsg('添加成功');
              // row.order_complete.$set(true);
              // this.$set(this.order, index, true)
          } else {
              this.showErrorMsg(response.data.msg);
          }
          this.getMyOrderList();
        })
        // this.getMyOrderList();
      // console.log(index, row.creat_time);
      this.addDia = false;
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

<style scoped>
.col-md-12.column {
  padding: 0px;
}
</style>
