<template>
  <div class="app-container">
    <header>
      <div class="logo">
        <img src="../assets/logo.png" alt="">
        <span>博客论坛系统后台管理</span>
      </div>
      <el-dropdown style="float: right;" @command="handleCommand">
        <span class="el-dropdown-link" style="cursor: pointer">
          <img v-if="avatar" :src="avatar" class="avatar">
          欢迎你！{{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="person">个人信息</el-dropdown-item>
          <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </header>
    <!-- 路由动态渲染 -->
    <div class="main-content">
      <el-menu class="side-menu" :default-active="$route.path" @select="handleMenuSelect">
        <div v-for="item in permissions" :key="item.path">
          <el-menu-item :index="'/manage' + item.path" v-if="!item.children.length ">
            <i :class="['el-icon-' + item.icon]"></i>
            <span>{{ item.name }}</span>
          </el-menu-item>
          <el-submenu :index="item.path" v-if="item.children.length ">
            <template slot="title">
              <i :class="['el-icon-' + item.icon]"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="subItem in item.children" :key="subItem.path" :index="'/manage' + subItem.path"
                          >
              <i :class="['el-icon-' + subItem.icon]"></i>
              <span>{{ subItem.name }}</span>
            </el-menu-item>
          </el-submenu>
        </div>

      </el-menu>

      <router-view class="main-container" :key="Math.random()" @call="getMenu"/>
    </div>
  </div>
</template>

<script>


import API from "@/utils/request";

export default {
  name: 'Manage',
  components: {},
  data() {
    return {
      user: {},
      permissions: [],
      avatar:''
    };
  },
  created() {
    this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
    console.log(this.user.avatar)
    this.avatar = "http://localhost:9999/files/" + this.user.avatar
    this.getMenu()
  },
  methods: {
    getMenu() {
      this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
      API.get('/api/permission').then(res => {
        this.permissions = res.data
        console.log(this.permissions)
      })
    },
    handleCommand(command) {
      if (command === 'person') {
        this.$router.push('/manage/person');
      }
      if (command === 'loginOut') {
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("permission")
        this.$router.replace('/login');

      }
    },
    handleMenuSelect(index) {
      console.log(index)
      this.$router.push(index);
    },
  },
  computed: {},
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  margin-bottom: 3px;
  line-height: 50px;
  padding: 0 16px;
  font-size: 18px;
  font-weight: bold;
  background-color: #151515;
  box-shadow: 0 0 4px 4px #e6e6e6;
  display: flex;
  justify-content: space-between;
}

/* logo区域 */
.logo {
  height: 70px;
  display: flex;
  line-height: 70px;
  /* margin-left: 10px; */
}

.logo span {
  display: block;
  color: #f9e1cf;
  margin-left: 10px
}

.el-dropdown {
  color: #f9e1cf;
  line-height: 70px;
}

.el-dropdown-link {
  display: flex;
}

.el-dropdown-link i{
  line-height: 70px;
}

.el-dropdown .avatar {
  width: 40px;
  border-radius: 50%;
  align-self: center;
  margin-right: 10px;
}

/* 菜单区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.side-menu {
  width: 250px;
  height: 100%;
  background-color:#00162a
}

.el-menu-item{
  background-color: #00162a;
}

.el-menu-item a {
  text-decoration: none;
}

.el-menu-item span{
  color: #fff;
  font-size: 16px;
}
.el-submenu span{
  color: #fff;
}

.el-menu-item:focus,.el-menu-item:hover{
  background-color: #1890ff;
}

.el-menu-item.is-active a {
  color: #409EFF;
}

/* 具体内容区域 */
.main-container {
  margin-left: 3px;
  padding: 10px;
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
}
</style>
