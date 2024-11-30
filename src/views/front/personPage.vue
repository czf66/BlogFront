<template>
  <div class="main-content" style="width: 70%;margin: auto">

    <el-tabs v-model="activeName" @tab-click="clickTab">
      <el-tab-pane label="个人资料" name="个人资料">
        <person />
      </el-tab-pane>
      <el-tab-pane label="我发表的博客" name="我发表的博客">
        <div class="card" style="padding: 5px"><el-button type="primary" @click="addBlog">发表新博客</el-button></div>
        <div style="margin-top: 10px">
          <blog-list type="blog" :show-opt="true" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="我的点赞" name="我的点赞">
        <div style="margin-top: 10px">
          <blog-list type="like" :show-opt="false" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="我的收藏">
        <div style="margin-top: 10px">
          <blog-list type="collect" :show-opt="false" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的评论" name="我的评论">
        <div style="margin-top: 10px">
          <blog-list type="comment" :show-opt="false" />
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import person from "./person1.vue";
import BlogList from "./BlogList";

export default {
  components: {
    person,
    BlogList,
  },
  data() {
    return {
      activeName: '个人资料'
    }
  },
  created() {

  },
  methods: {
    // 跳转到新页面
    addBlog() {
      window.open('/front/newBlog')
    },
    clickTab(tab) {
      console.log(tab)
    },
  }
}
</script>

<style scoped>
.el-form-item__label {
  font-weight: bold;
}
.el-upload {
  border-radius: 50%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border-radius: 50%;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
</style>