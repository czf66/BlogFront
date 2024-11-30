<template>
  <div>
    <div class="card" style="min-height: 80vh;margin-bottom: 100px;">
      <el-card >
        <div class="blog-box" v-for="item in tableData" :key="item.id" v-if="total > 0">
          <div style="flex: 1; width: 0">
            <a  target="_blank"><div class="blog-title" @click="blogDetail(item.id)">{{ item.title }}</div></a>
            <div class="line1" style="color: #666; margin-bottom: 10px; font-size: 13px">{{ item.descr }}</div>
            <div style="display: flex; align-items: center">
              <div style="flex: 1; font-size: 13px">
                <span style="color: #666; margin-right: 20px"><i class="el-icon-user"></i> {{ item.userName }}</span>
                <span style="color: #666; margin-right: 20px"><i class="el-icon-view"></i> {{ item.readCount }}</span>
                <span style="color: #666"><i class="iconfont icon-dianzan"></i> {{ item.likesCount }}</span>

                <el-button v-if="showOpt" type="danger" plain style="margin-left: 40px;  cursor: pointer" @click="del(item.id)"><i class="el-icon-delete"></i>删除</el-button>
                <el-button v-if="showOpt" type="primary" plain style="margin-left: 10px; cursor: pointer" @click="editBlog(item.id)"><i class="el-icon-edit"></i>编辑</el-button>
              </div>
              <div style="width: fit-content">
                <el-tag v-for="item in JSON.parse(item.tags || '[]')" :key="item" type="primary" style="margin-right:5px">{{ item }}</el-tag>
              </div>
            </div>
          </div>
          <div style="width: 100px">
            <img style="width: 100%; height: 80px; border-radius: 5px" :src="$baseUrl + '/files/' + item.cover" alt="">
          </div>
        </div>
        <div v-if="total === 0" style="padding: 20px 0; text-align: center; font-size: 16px; color: #666">暂无数据</div>
        <div style="margin-top: 10px" v-if="total">
          <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[5, 10, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import API from "@/utils/request";
import router from '../../router'

export default {
  name: "BlogList",
  props: {
    categoryName: null,
    type: null,
    showOpt: false,
    
  },
  data() {
    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
      user: JSON.parse(sessionStorage.getItem("user")) || {},
      title:this.$route.query.title // 看是否有从查询框传过来的数据
    }
  },
  // watch: {  // 监听数据变化  加载最新数据
  //   categoryName() {
  //     this.loadBlogs(1)
  //   }
  // },
  created() {
    this.loadBlogs(1)
  },
  methods: {
    // 编辑博客数据
    editBlog(blogId) {
      window.open('/front/newBlog?blogId=' + blogId)
    },
    // 点击标题跳转到博客详细页
    blogDetail(blogId){
      router.push({
        path:'./details',
        query:{id:blogId} //将博客ID传到博客详细页
      })
    },
    // 删除自己发的博客
    del(id) {   // 单个删除
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
        API.delete('/api/blog/remove/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
            this.loadBlogs(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    // 根据personPage传过来的type选择哪个接口
    loadBlogs(pageNum) {
      console.log("**"+this.title)
      if (pageNum) this.pageNum = pageNum
      let url
      switch (this.type) {
        case 'blog': url = '/api/blog/pageAudit'; break; // 获取发布的博客
        case 'like': url = '/api/blog/likes'; break; // 获取点赞的博客
        case 'collect': url = '/api/blog/collect'; break; //获取收藏的博客
        case 'comment': url = '/api/blog/comment'; break; //获取评论过的博客
        default: url = '/api/blog/pageAudit'
      }
      // 找不到title的数据就是查询该用户的
      if(this.title === undefined){
        API.get(url, {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            userId:this.user.id,
          }
        }).then(res => {
          console.log(res.data.list)
          this.tableData = res.data?.list
          this.total = res.data?.total
        })
      }
      // 有title的数据就是根据标题查询
      if(this.title !== undefined){
        API.get(url, {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          title:this.title
        }
      }).then(res => {
        console.log(res.data.list)
        this.tableData = res.data?.list
        this.total = res.data?.total
      })
      }
    },
    // 换页功能
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.loadBlogs(pageNum)
      this.scrollToTop()
    },
    // 设置一页多少条数据
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.loadBlogs()
    },
    scrollToTop() {
      // 使用原生JavaScript方法将滚动条滚动到顶部
      window.scrollTo({
        top:0,
        left:0,
        behavior: 'smooth'
    });
    }
  }
}
</script>

<style scoped>
.blog-box {
  display: flex;
  grid-gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}
.blog-box:first-child {
  padding-top: 0;
}
.blog-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  cursor: pointer;
  color: #000;
}
.blog-title:hover {
  color: #2a60c9;
}
.line1 {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>