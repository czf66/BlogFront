<template>
  <div>
    <!--    头部-->

    <Header></Header>

    <!-- 主体 -->
     <!-- <el-col :span="16" :offset="4"> -->
    <Content></Content>

    <!-- 尾部 -->
    <Footer v-show="$route.meta.show"></Footer>

  </div>
</template>

<script>
import Header from './Header.vue';
import Content from './Content.vue';
import Footer from './Footer.vue';

export default {
  name: "Front",
  components:{Header,Content,Footer},

}
</script>
