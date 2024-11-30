<template>
    <div style="width: 100%; height: 60px; line-height: 60px; background-color: #151515;">
        <el-row>
            <el-col :span="6">
                <div style="font-size: 20px; font-weight: bold; color: #409EFF; text-align: center;display: flex;height: 70px;">
                <img src="../assets/logo.png" alt="" style="margin-right: 10px;height: 60px;">
                <span style="color: #f9e1cf;">广软博客论坛系统</span></div>
            </el-col>
            <el-col :span="14">
                <el-menu class="side-menu" :default-active="$route.path" @select="handleMenuSelect" mode="horizontal" style="background-color: #151515;">
                <el-menu-item index="/front/home" >
                    首页
                </el-menu-item >
                <el-menu-item index="/front/notice">
                    公告
                </el-menu-item>
                <el-menu-item index="/front/message">
                    留言板
                </el-menu-item>
                <el-menu-item index="/front/personPage">
                    个人中心
                </el-menu-item>
                <el-menu-item style="margin-left: 100px;">
                    <el-input
                    v-model="title"
                    style="width: 240px;font-size: 16px;"
                    placeholder="请输入标题进行查询"
                    >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-button type="primary" size="medium" @click="goSearch(title)" style="margin-left: 10px;">查询</el-button>
                </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="4">
                <div style="text-align: right; padding-right: 10px" v-if="user.id">
                <el-dropdown style="float: right;text-align: center;" @command="handleCommand">
                  <span class="el-dropdown-link" style="cursor: pointer;color: #f9e1cf;font-size: 16px;">
                  <img v-if="user.avatar" :src="$baseUrl + '/files/' +user.avatar" class="avatar">
                  欢迎你！{{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="person">个人信息</el-dropdown-item>
                    <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                </div>
                <div style="text-align: right; padding-right: 10px" v-else>
                <el-button @click="$router.replace('/login')">登录</el-button>
                <el-button @click="$router.replace('/register')">注册</el-button>
                </div>

            </el-col>
        </el-row>
    </div>
</template>

<script>
export default{
    name: "Header",
    data() {
    return {
      user: {},
      title:this.$route.query.title // 这样设置打开新页面才能传该数据过去
    }
  },
  created() {
    this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
  },
  methods: {
    // 查询弹出另外一个界面
    goSearch(title){
      if(title == null){ 
        this.$message({
          message: '请输入搜索内容',
          type: 'warning'
        });
        }
      else 
      {
        window.open('/front/search?title=' + title)
        this.title = null
    }
    },
    handleCommand(command) {
      if (command === 'person') {
        this.$router.push('/front/person');
      }
      if (command === 'loginOut') {
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("activeIndex")
        sessionStorage.removeItem("current")
        this.$router.replace('/login');

      }
    },
    handleMenuSelect(index) {
      console.log(index)
      this.$router.push(index);
    },
  }
}
</script>

<style scoped>
.side-menu .el-menu-item{
  color: #f9e1cf;
}

.side-menu .el-menu-item:hover{
  background-color: #b098ff;
  color: #fff;
}

.side-menu .el-menu-item:last-child:hover{
  background-color: black;
}

.avatar{
  width: 40px;
  border-radius: 50%;
  vertical-align: middle;
  /* margin-right: 10px; */
}
</style>