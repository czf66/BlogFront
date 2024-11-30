<template>
  <div>
    <div style="width: 100%; height: 100vh; overflow: hidden" class="bgImg">
      <div class="form">

        <div style="width: 260px; margin: 0 auto; padding-top: 30px">
          <div class="item" style="font-size: 20px; color: white">校园博客论坛登录</div>
          <div class="item">
            <input type="text" class="inputItem" placeholder="请输入用户名" v-model="user.username">
          </div>

          <div class="item">
            <input type="password" class="inputItem" placeholder="请输入密码" v-model="user.password">
          </div>
          <div class="item">
            <el-radio-group v-model="user.role">
              <el-radio label="ADMIN" style="color: #fff;">管理员</el-radio>
              <el-radio label="USER" style="color: #fff;">用户</el-radio>
            </el-radio-group>
          </div>
          <div class="item" style="text-align: left; display: flex" v-show="count === 0">
            <input type="text" class="inputItem" style="flex: 1;" v-model="code">
            <span @click="refreshCode" style="cursor: pointer; flex: 1;">
              <Identify :identifyCode="identifyCode"></Identify>
             </span>
          </div>
          <div class="item">
            <button class="loginBtn" @click="login">登录</button>
          </div>
          <div style="padding: 10px 0; text-align: right">
            <span style="cursor: pointer; color: dodgerblue" @click="preReset">忘记密码</span>
            <span style="cursor: pointer; color: dodgerblue; margin-left: 10px" @click="goRegister">去注册</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗   -->
    <el-dialog title="忘记密码" :visible.sync="dialogFormVisible" width="30%"
               :close-on-click-modal="false" >
      <el-form :model="reset">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="reset.username" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="reset.phone" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px">
          <el-input show-password v-model="reset.password" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">重置</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import API from "@/utils/request";
import {resetRouter} from "@/router";
import Identify from "@/components/common/Identify";


export default {
  name: "Login",
  data() {
    return {
      reset: {},
      dialogFormVisible: false,
      code: '',
      count: 0,
      user: { role: 'ADMIN' },
      // 图片验证码
      identifyCode: '',
      // 验证码规则
      identifyCodes: '123456789ABCDEFGHGKMNPQRSTUVWXY',
    }
  },
  mounted() {
    this.refreshCode()
  },
  components: {Identify},
  methods: {
    // 注册
    goRegister() {
      this.$router.replace("/register")
    },
    // 打开修改密码弹窗
    preReset() {
      this.dialogFormVisible = true
      this.reset = {}
    },
    // 修改密码
    save() {
      API.put("/api/user/reset", this.reset).then(res => {
        if (res.code === '200') {
          this.$message({
            type: "success",
            message: "重置成功，您的密码已修改，请重新登录"
          })
          this.dialogFormVisible = false
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[Math.floor(Math.random() * (this.identifyCodes.length))]
      }
    },
    // 登录
    login() {
      if (!this.user.username) {
        this.$message({
          type: "warning",
          message: "请输入用户名"
        })
        return;
      }
      if (!this.user.password) {
        this.$message({
          type: "warning",
          message: "请输入密码"
        })
        return;
      }
      // if (!this.code) {
      //   this.$message({
      //     type: "warning",
      //     message: "请输入验证码"
      //   })
      //   return;
      // }
      if (this.count === 3) { //将this.count === 3 改为 this.count === 0 就可以生效了
        if (this.code !== this.identifyCode.toLowerCase()) {
          this.$message({
            type: "error",
            message: "验证码错误"
          })
          return;
        }
      }

      API.post("/account/login", this.user).then(res => {
        if (res.code === '200') {
          this.$message({
            type: "success",
            message: "登录成功"
          })
          sessionStorage.setItem("user", JSON.stringify(res.data))  // 保存用户信息
          setTimeout(() => {
            // 跳转主页
            if (res.data.role === 'ADMIN') {
              API.get("/api/permission/all").then(res => {
                sessionStorage.setItem("permission", JSON.stringify(res.data))  // 保存路由
                resetRouter(JSON.parse(JSON.stringify(res.data)))  // 重置路由
                this.$router.replace("/manage/home")
              })
            } else {
              this.$router.replace("/front/home")
              sessionStorage.setItem("activeIndex",'0')
              sessionStorage.setItem("current",'全部博客')
            }
          }, 500)
          

        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.bgImg {
  background: url("../assets/sun-setting-over-ocean.jpg") no-repeat;
  background-size: 100% 100vh;
}

.form{
  width: 500px; 
  height: 350px; 
  background-color:rgba(0, 0, 0, 0.2); 
  border-radius: 10px;
  margin: 175px auto;
}

.item {
  text-align: center;
  padding: 10px 0;
}

.loginBtn {
  background: dodgerblue;
  border-radius: 5px;
  color: white;
  width: 100%;
  padding: 10px;
  cursor: pointer
}

.inputItem {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
}
</style>
