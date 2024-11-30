<template>
    <el-row >
      <el-col :span="20" :offset="2">
        <router-view />
      </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "Content",
    };
</script>