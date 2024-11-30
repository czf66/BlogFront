<template>
    <div>
      <el-row>
        <el-col :span="20" :class="{ 'text-item-active': categoryId == undefined }"> 
          <div>
            <el-card style="margin-top: 10px">
              <div style="text-align: center;">
                  <h1>{{ tableData.title }}</h1>
              </div>
              <div style="text-align: center;">
                <span style="margin-right: 10px;font-size: 20px;color: #666;"><i class="el-icon-user">{{ tableData.userName }}</i></span>
                <span style="margin-right: 10px;font-size: 20px;color: #666;"><i class="el-icon-date">{{ tableData.date }}</i></span>
                <span style="margin-right: 10px;font-size: 20px;color: #666;"><i class="el-icon-view">{{ tableData.readCount }}</i></span>
                <span>
                  <el-tag type="primary" style="margin-right: 10px;font-size: 20px;" v-for="tag in JSON.parse(tableData.tags)">{{ tag }}</el-tag>
                </span>
              </div>
              <div >
                <div style="font-size: 18px;" v-html="tableData.content">

                </div>
              </div>
              <div>
                <el-button style="margin-right: 10px;font-size: 20px;" type="primary" plain @click="setLikes" class="iconfont icon-dianzan" :class="{'active': tableData.userLikes}">
                  <span style="padding-left: 5px;">{{ tableData.userLikes ? '已点赞' : '点赞' }}</span>
                  {{ tableData.likesCount }}
                </el-button>
                <el-button style="margin-right: 10px;font-size: 20px;" type="primary" plain @click="setCollect" class="iconfont icon-shoucang" :class="{'active': tableData.userCollect}">
                  <span style="padding-left: 5px;">{{ tableData.userCollect ? '已收藏' : '收藏' }}</span>
                  {{ tableData.collectCount }}
                </el-button>
              </div>
            </el-card>
            <!-- 评论区 -->
            <div style="margin-top: 10px; margin-bottom: 80px">
              <el-card>
                <h2 style="margin-bottom: 20px">评论共 {{ commentCount }} 条</h2>
                <div style="padding: 20px; color: #888">
                  <div>
                    <el-input type="textarea" :rows="3" v-model="entity.content"></el-input>
                    <div style="text-align: right; padding: 10px"><el-button type="primary" @click="review">评论</el-button></div>
                  </div>
                </div>

                <!-- 评论 -->
                <div style="display: flex; padding: 20px;font-size: 18px;" v-for="item in comment">
                  <div style="text-align: center; flex: 1">
                    <el-image :src= "$baseUrl + '/files/' + item.avatar" style="width: 60px; height: 60px; border-radius: 50%"></el-image>
                  </div>
                  <div style=" flex: 5">
                    <div><b style="font-size: 14px">用户：{{ item.userName }}</b></div>
                    <div style="padding: 10px 0; ">
                      {{ item.content }}
                      <el-button type="text" size="mini" @click="del(item.id)" v-if="item.userName === user.username">
                        <i class="el-icon-delete" style="font-size: 16px;">删除</i>
                      </el-button>
                    </div>
                    <div style="color: #888; font-size: 16px">
                      <span>{{ item.time  }}</span>
                      <el-button type="text" style="margin-left: 20px;font-size: 16px;" @click="reReply(item.id)">回复</el-button>
                    </div>
                    <!-- 回复 -->
                    <div style="background-color: #fff; padding: 10px;" v-for="children in item.children">
                      <img :src="$baseUrl + '/files/' + children.avatar" alt="" style="width: 50px; height: 50px; border-radius: 50%">
                      {{ children.userName }}：{{ children.content }}
                      <el-button type="text" size="mini" @click="del(children.id)" v-if="children.userName === user.username"><i class="el-icon-delete" style="font-size: 16px;">删除</i></el-button>
                    <div style="color: #888; font-size: 16px">
                      <span>{{ children.time  }}</span>
                    </div>
                    </div>
                  </div>
                </div>

                <el-dialog title="回复信息" :visible.sync="dialogFormVisible" width="30%"
                          :close-on-click-modal="false">
                  <el-form :model="entity">
                    <el-form-item label="内容" label-width="120px">
                      <el-input v-model="entity.reply" autocomplete="off" type="textarea" :rows="3"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="reply">确 定</el-button>
                  </div>
                </el-dialog>
              </el-card>


            </div>
          </div>
        </el-col>
        <el-col :span="4" v-if="categoryId">
          <div>
            <el-card style="margin-top: 10px;width: 200px;margin-left: 10px;">
              <div style="font-weight: 1000;font-size: 18px;">关于作者</div>
              <div style="margin-top: 5px;margin-bottom: 5px;">
                <img v-if="avatar" :src="avatar" class="avatar">
                <span style="font-size: 20px;">{{ tableData.userName }}</span>
              </div>
              <div style="font-size: 18px;display: flex;margin-bottom: 10px;justify-content: space-between;">
                <div >文章</div>
                <div >点赞</div>
                <div>收藏</div>
              </div>
              <div style="font-size: 18px;display: flex;color: rgb(136, 136, 136);justify-content: space-between;">
                <div style="margin-left: 10px;">{{ authorData.blogCount }}</div>
                <div >{{ authorData.likesCount }}</div>
                <div style="margin-right: 10px;">{{ authorData.collectCount }}</div>
              </div>
            </el-card>
            <el-card style="width: 200px;margin-left: 10px;margin-top: 10px;" shadow="hover">
              <div slot="header" class="clearfix">
                <span>相关推荐</span>
              </div>
              <div v-for="item in categoryData" :key="item.id" class="about">
                <el-tooltip :content="item.title" placement="top">
                  <span @click="changeBolg(item.id,item.userId)">{{ item.title }}</span>
                </el-tooltip>
                <div>
                  <i style="margin-right: 5px;">{{ item.readCount }}阅读  </i>
                  <i>{{ item.likesCount }}点赞 </i>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import API from "@/utils/request";
  
  export default {
    name: "details",
    data() {
      return {
        tableData:[], // 博客详细信息
        BlogId:this.$route.query.id, // 博客ID从前面选择传过来的
        categoryId:this.$route.query.categoryId, //博客分类ID从前面选择传过来的
        user: {},
        avatar:'',
        comment: [], //评论信息
        dialogFormVisible: false, //弹窗是否打开
        entity: {}, // 传到后端的数据
        commentCount:0, //评论数
        authorData:[],
        categoryData:[]
      }
    },
    created() {
      this.load()
      console.log(this.BlogId+"***")
      console.log(this.categoryId+"***")
      this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
      this.avatar = "http://localhost:9999/files/" + this.user.avatar
      this.loadMessage();
    },
    methods: {
      // 获取博客信息
      load(){
        API.get('/api/blog/' + this.BlogId).then(res => {
          this.tableData = res.data
          console.log(this.tableData)
        })
        // 获取作者信息
        setTimeout(() => {
          API.get('/api/blog/author/' + this.tableData.userId).then(res => {
            this.authorData = res.data
            console.log(this.authorData)
        })
        }, 1000);
        // 根据博客分类ID获取博客信息
        API.get('/api/blog/category/' + this.categoryId + '/' + this.BlogId).then(res => {
          this.categoryData = res.data
          console.log(this.categoryData)
        })
      },

      // 根据相关推荐的点击显示不同的博客信息
      changeBolg(id,userId){
        // window.open('/front/details?blogId=' + id + '&userId=' + userId)
        const loading = this.$loading({
          lock: true,
          text: '请稍后，正在为您加载...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.9)'
        });
        setTimeout(() => {
          loading.close();
          // 获取博客信息
          API.get('/api/blog/' + id).then(res => {
            this.tableData = res.data
            console.log(this.tableData)
          }),
          // 获取作者信息
          API.get('/api/blog/author/' + userId).then(res => {
            this.authorData = res.data
            console.log(this.authorData)
          })
          //将滚动条滚动到顶部
          this.scrollToTop()
        }, 1000);
        
      },

      // 点赞与取消点赞
      setLikes(){
        console.log("已点击")
        API.post("/api/likes/set",{ fid:this.BlogId, module:'博客'}).then(res=>{
          console.log(this.tableData)
          if(res.code == '200'){
              if(this.tableData.userLikes == false){
                this.$message.success("点赞成功")
                this.load()
              }else{
                this.$message("取消点赞")
                this.load()
              }
            }
          })
      },

      // 收藏与取消收藏
      setCollect(){
        console.log("已点击")
        API.post("/api/collect/set",{ fid:this.BlogId, module:'博客'}).then(res=>{
          if(res.code == '200'){
            if(this.tableData.userCollect == false){
                this.$message.success("收藏成功")
                this.load()
              }else{
                this.$message("取消收藏")
                this.load()
              }
            }
          })
      },
      logout() {
        $.get("/api/user/logout");
        sessionStorage.removeItem("user");
        location.href = "/page/end/login.html";
      },

      // 获取评论信息
      loadMessage() {
        API.get("/api/comment/selectForUser",
          {params: {  fid: this.BlogId, module: '博客' }}
        ).then(res => {
          this.comment = res.data;
        }),
        API.get("/api/comment/selectAll",
          {params: {  fid: this.BlogId, module: '博客' }}
        ).then(res => {
          this.commentCount = res.data;
          console.log("***"+res.data)
        }),
        API.get("/api/comment/selectForUser",
          {params: {  fid: this.BlogId, module: '博客' }}
        ).then(res => {
          console.log(res.data)
        })
      },

      // 关闭回复弹窗
      cancel() {
        this.dialogFormVisible = false;
        this.entity = {};
      },

      // 打开弹窗回复并将返回后端的数据进行填充
      reReply(id) {
        this.dialogFormVisible = true;
        this.entity.rootId = id;
        this.entity.pid = id;
        this.entity.fid = this.BlogId
        this.entity.module = '博客'
        this.entity.userId = this.user.id
      },

      reply() {
        this.entity.content = this.entity.reply;
        this.save();
      },

      // 进行评论
      review(){
        this.entity.fid = this.BlogId
        this.entity.module = '博客'
        this.entity.userId = this.user.id
        this.save()
      },

      // 添加评论
      save() {
        if (!this.user.username) {
          this.$message({
            message: "请登录",
            type: "warning"
          });
          return;
        }
        if (!this.entity.content) {
          this.$message({
            message: "请填写内容",
            type: "warning"
          });
          return;
        }
        API.post("/api/comment/save", this.entity).then(res => {
          if (res.code === '200') {
            this.$message({
              message: "评论成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
          this.entity = {}
          this.loadMessage();
          this.dialogFormVisible = false;
        })
      },

      // 删除评论
      del(id) {
        this.$confirm('是否删除该评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          API.delete("/api/comment/remove/" + id).then(res => {
          this.loadMessage()
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        // API.delete("/api/comment/remove/" + id).then(res => {
        //   this.$message({
        //     message: "删除成功",
        //     type: "success"
        //   });
        //   this.loadMessage()
        // })
      },
      
      scrollToTop() {
      // 使用原生JavaScript方法将滚动条滚动到顶部
      window.scrollTo({
        top:0,
        left:0,
        behavior: 'smooth' // 缓慢上升
      });
    }
    }
  }
  </script>
  
  <style scoped>
  .avatar {
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .active{
    color: rgb(1, 73, 255) !important;
  }

  .text-item-active {
    width:  100%;
    margin: 0;
    padding: 0;
  }

  .about {
    margin-top: 10px ;
    padding-top: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .about span:hover{
    color: #409EFF;
    cursor: pointer;
  }
  </style>
  