<template>
    <div style="margin: 5px auto; width: 80%">
      <div style="margin-bottom: 20px;font-size: 20px;text-align: center;">查询结果如下</div>
      <blog-list />
    </div>
  </template>
  
  <script>
  import BlogList from "./BlogList.vue";
  export default {
    name: "Search",
    components: {BlogList},
  }
  </script>
  
  <style scoped>
  
  </style>