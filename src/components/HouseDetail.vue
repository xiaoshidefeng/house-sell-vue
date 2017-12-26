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
						<div class="form-group">
							<input type="text" class="form-control" />
						</div> <button type="submit" class="btn btn-default">Submit</button>
					</form>
					<ul class="nav navbar-nav navbar-right">
						<li>
							 <a href="#">Link</a>
						</li>
						<li class="dropdown">
							 <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown<strong class="caret"></strong></a>
							<ul class="dropdown-menu">
								<li>
									 <a href="#">Action</a>
								</li>
								<li>
									 <a href="#">Another action</a>
								</li>
								<li>
									 <a href="#">Something else here</a>
								</li>
								<li class="divider">
								</li>
								<li>
									 <a href="#">Separated link</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
				
			</nav>
			<div class="jumbotron">
				<h1>
                    {{this.house.house_name}}
				</h1>
                <p>
                     描述： {{this.house.house_desc}}
                </p>
                <p>
                     地址： {{this.house.house_address}}
                </p>
                <p>
                    大小： {{this.house.house_size}}
                </p>
                <p>
                    价格： {{this.house.house_prices}} 元/月
                </p>
                <p v-if="this.house.house_sell">
                    正在出售
                </p>
                <p v-else>
                  未出售
                </p>
                <el-button type="primary" round @click="buyDia = true">立即租房</el-button>
                
			</div>

            <el-dialog
                title="租房订单确认"
                :visible.sync="buyDia"
                width="30%"
                center>
                <span>已下是你要租的房子信息：</span>
                <p>
                    {{this.house.house_name}} <br>  
                    描述： {{this.house.house_desc}} <br> 
                    地址： {{this.house.house_address}} <br> 
                    大小： {{this.house.house_size}} <br> 
                    价格： {{this.house.house_prices}} 元/月
                </p>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="buyDia = false">取 消</el-button>
                    <el-button type="primary" @click="rentHouse()">租 房</el-button>
                </span>
            </el-dialog>
		</div>
	</div>
</div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      api: 'http://localhost:8888/api',
      house: '',
      buyDia: false

    }
  },
  created() {
      this.getHouse();
  },
  methods: {
      getHouse() {
          console.log(this.$route.params.id);
          this.$axios.get(this.api + '/house/' + this.$route.params.id).then((response) => {
              this.house = response.data.data;
          })
      },
      rentHouse() {
        if (!this.getCookie('username')) {
            this.showErrorMsg('未登录');
            return;
        }
        var userName = this.getCookie('username');
        var userId = this.getCookie('userid');
        var houseId = this.house.house_id;
        var houseName = this.house.house_name;
        var housePrice = this.house.house_prices;
        var qs = require('qs');
        this.$axios.post(this.api + '/rentHouse', qs.stringify({
          user_name: userName,
          user_id: userId,
          house_id: houseId,
          house_name: houseName,
          house_price: housePrice
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
          console.log(response);
          if (response.data.code == 200) {
              this.showSuccessMsg('订单已提交，请前去付款');
          } else {
              this.showErrorMsg(response.data.msg);
          }
        })

        this.buyDia = false;

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
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
