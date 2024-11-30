<template>
  <div class="login-container">
    <div class="login-image">
      <img src="../../assets/pexels-felixmittermeier-956999.jpg" alt="登录图片" />
    </div>
    <div class="login-form">
      <el-card class="login-card" shadow="hover">
        <h2 class="login-title">校园博客论坛登录</h2>
        <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="0px">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="loginForm.role">
              <el-radio label="admin">管理员</el-radio>
              <el-radio label="user">用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
          </el-form-item>
          <div class="register-link">
            还没有账号？ <el-link href="/register">立即注册</el-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        role: 'user'
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 处理登录逻辑，例如调用API
          console.log('登录成功');
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
}

.login-image {
  flex: 1;
  background-color: #f5f5f5;
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-form {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  width: 350px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}

.login-title {
  text-align: center;
  color: #1a73e8;
  font-size: 24px;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
  text-align: center;
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>
