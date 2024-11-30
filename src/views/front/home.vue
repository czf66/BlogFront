<template>
  <div class="home">
    <div class="Topimg">
      <!-- <el-row> -->
        <!-- <el-col :xs="12" :sm="12" :md="12" :lg="24" :xl="12"> -->
          <el-carousel height="260px">
            <el-carousel-item v-for="item in imgList" :key="item">
              <img style="width: 100%" :src='item' alt="">
            </el-carousel-item>
          </el-carousel>
        <!-- </el-col>
      </el-row> -->
    </div>

    <!--    其他-->
    
      <div class="content">
        <el-row>
          <el-col :span="4">
            <div class="left">
              <el-card class="box-card" shadow="hover">
                  
                  <div class="text-item" :class="{ 'text-item-active': category.name === current }" 
                  v-for="category in categoryList" :key="category.id"  @click="changeCategory(category.name)">
                    {{ category.name }}
                  </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="15">
            <div class="right">
              <el-card  shadow="hover">
                <div class="recommend">
                  <el-menu :default-active="activeIndex" active-text-color="#409EFF" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1" @click="sortBywhat(1)" style="font-size: 18px;">热榜</el-menu-item>
                    <el-menu-item index="2" @click="sortBywhat(2)" style="font-size: 18px;">最新</el-menu-item>
                  </el-menu>
                </div>
                <div class="card" style="display: flex;" v-for="item in tableData" v-if="total > 0" @click="skipDetails(item.id,item.categoryId)">
                  <div> 
                    <img :src="$baseUrl + '/files/' + item.cover" alt="">
                  </div>
                  <div class="rightCard">
                    <div class="title" >
                      <h3>{{item.title}}</h3>
                    </div>
                    <div class="line1" style="margin-bottom: 20px;font-size: 16px;color: #666;">
                      {{ item.descr }}
                    </div>
                    <div style="display: flex;justify-content: space-between;">
                      <div>
                        <span style="margin-right: 10px;font-size: 16px;color: #666;"><i class="el-icon-user">{{ item.userName }}</i></span>
                        <span style="margin-right: 10px;font-size: 16px;color: #666;"><i class="el-icon-view">{{ item.readCount }}</i></span>
                        <span style="font-size: 16px;color: #666;"><i class="iconfont icon-dianzan">{{ item.likesCount }}</i></span>
                      </div>
                      <div style="width: fit-content;">
                        <el-tag type="primary" style="font-size: 16px;" v-for="tag in JSON.parse(item.tags)">{{ tag }}</el-tag>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="total === 0" style="padding: 20px 0; text-align: center; font-size: 16px; color: #666">暂无数据</div>
              </el-card>
              <!-- 分页功能 -->
              <div style="margin-top: 10px" v-if="total">
                  <el-pagination
                      background
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="pageNum"
                      :page-size="pageSize"
                      :page-sizes="[2, 5, 10]"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total"
                  >
                  </el-pagination>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div>
              <el-card style="width: 260px;" shadow="hover">
                <div style="font-weight: 1000;font-size: 18px;">欢迎来到广软博客论坛 😊</div>
                <div style="margin-top: 10px;color: #666;">可以在这里记录美好生活哦</div>
              </el-card>
            </div>
            <div>
              <el-card style="width: 260px;margin-top: 10px;" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>热门文章</span>
                  <el-button style="float: right; padding: 3px 0;font-size: 14px;" type="text" @click="refreshTop"><i class="el-icon-refresh"></i> 换一换</el-button>
                </div>
                <div v-for="item in showList" :key="item.id" class="line2">
                  <span style="width: 18px; display: inline-block; ">
                    <span style="color: orangered" v-if="item.index === 1">{{ item.index }}</span>
                    <span style="color: goldenrod" v-else-if="item.index === 2">{{ item.index }}</span>
                    <span style="color: dodgerblue" v-else-if="item.index === 3">{{ item.index }}</span>
                    <span style="color: #666" v-else>{{ item.index }}</span>
                  </span>
                  <el-tooltip :content="item.title" placement="top" effect="light">
                    <span @click="skipDetails(item.id,item.categoryId)">{{ item.title }}</span>
                  </el-tooltip>
                </div>
              </el-card>
            </div>
            <div class="advert">
              <el-carousel direction="none">
                <el-carousel-item v-for="item in imgList2" :key="item">
                  <img :src='item.src' alt="" @click="goAddress(item.BlogId,item.categoryId)">
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-col>
        </el-row>
      </div>
    

  </div>
</template>

<script>
import API from "@/utils/request";
import router from '@/router'

const url = "/api/category/"

export default {
  name: "Home",
  data() {
    return {
      imgList: [
        require('@/assets/woman-watching-beach-sunrise.jpg'),
        require('@/assets/mountain-wanderlust.jpg'),
        require('@/assets/prairie-sunset-silhouette.jpg'),
      ],
      imgList2:[
        {src:require('@/assets/1.jpg'),BlogId:'25',categoryId:'7'},
        {src:require('@/assets/2.jpg'),BlogId:'27',categoryId:'7'},
        {src:require('@/assets/3.jpg'),BlogId:'28',categoryId:'7'},
        {src:require('@/assets/4.png'),BlogId:'26',categoryId:'7'},
      ],
      user: {},
      categoryList:[], //后端传过来的分类
      tableData:[], //后端传过来的具体博客数据
      current: '全部博客',  //当前选中的分类名称
      pageNum: 1, //分页的第几页数据
      pageSize: 5, //分页的一页有几条数据
      total:0,
      activeIndex:'0',
      topList:[],
      showList: [],
      lastIndex:0,
    };
  },
  mounted() {
    this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
    this.current = sessionStorage.getItem("current") // 将此时选择的博客分类取出
    this.activeIndex = sessionStorage.getItem("activeIndex") // 将此时选择的排序分类取出
    this.load()
    this.loadBlogs(1)
    this.refreshTop()
    this.show()
  },
  methods: {
    show(){
        this.$alert(
        '<strong>欢迎来到广软博客论坛：</strong> </br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 为了营造更加活跃、健康、有序的校园网络交流环境，我们很高兴地宣布，经过技术团队的精心筹备与升级，全新的校园博客论坛系统现已正式上线！这一平台旨在搭建一个集信息共享、学术交流、文化展示及情感交流于一体的多元化空间，让每一位师生都能在这里找到属于自己的声音和舞台。</br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <strong style="color:#c60a0a;">【重要提示】</strong>为保障社区质量，请大家在发布内容时遵守国家法律法规及学校相关规定，文明上网，拒绝低俗、谣言等不良信息。</br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 我们诚挚邀请每一位师生加入这个大家庭，共同探索知识的海洋，分享生活的美好，携手构建一个充满活力与和谐的校园网络社区。您的每一条建议与反馈都是我们不断进步的动力，让我们携手前行，共创辉煌！</br></br><strong style="color:#E6A23C">更新日期：2025年4月20日</strong></br>', 
        '校园公告', 
        {
        confirmButtonText: '我已知晓',
        dangerouslyUseHTMLString: true,
      });
    },
    goAddress(BlogId,categoryId){
      const loading = this.$loading({
        lock: true,
        text: '页面正快马加鞭赶来，请稍等...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 1)'
      });
      setTimeout(() => {
        loading.close();
        router.push({
          path:'./details',
          query:{id:BlogId,categoryId:categoryId} //将博客ID、博客分类ID传到博客详细页
      })
      }, 1500);
    },
    refreshTop() {
      API.get('/api/blog/selectTop').then(res => {
        console.log(res.data)
        this.topList = res.data || []
        let i = 1
        this.topList.forEach(item => item.index = i++)

        // 0  5  0
        if (this.lastIndex === 20) {
          this.lastIndex = 0
        }
        this.showList = this.topList.slice(this.lastIndex, this.lastIndex+5)  // 0-5   5- 10  // 0-5
        this.lastIndex += 5  // 5  10  5
      })
    },
    // 点击不同分类
    changeCategory(categoryName){
      this.current = categoryName //将点击的分类名称赋值给current
      this.activeIndex = '0' // 将排序分类设为默认，即不按热榜与最新进行查询
      this.tableData = null // 将数据清空
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          target: document.querySelector('.right')
        });
        setTimeout(() => {
          loading.close();
          this.loadBlogs(1) //去后端拿不同分类的具体博客数据
        }, 1000);
      
    },
    // 获取分类数据
    load() {
      API.get(url).then(res => {
        this.categoryList = res.data || []
        this.categoryList.unshift({ name: '全部博客' }) //给从后端传过来的数据列添加‘全部博客’这条数据
        console.log(this.categoryList)
      })
    },
    // 获取具体博客数据
    loadBlogs(pageNum){
      if(pageNum) this.pageNum = pageNum
      console.log("***"+this.pageSize)
      console.log("///"+this.pageNum)
      console.log("---"+this.activeIndex)
      // 按照默认排序
      if(this.activeIndex === '0'){
        API.get("/api/blog/pageAudit/",{
          params:{
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            categoryName:this.current === '全部博客' ? null:this.current
          }
        }).then(res=>{
          this.total = res.data.total
          this.tableData = res.data.list
          console.log(this.tableData)
        })
      }
      // 选择浏览量排序
      if(this.activeIndex === '1'){
          API.get("/api/blog/page/readCount",{
          params:{
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            categoryName:this.current === '全部博客' ? null:this.current
          }
        }).then(res=>{
          this.total = res.data.total
          this.tableData = res.data.list
          console.log(this.tableData)
        })
      }
      // 选择发布时间排序
      if(this.activeIndex === '2'){
          API.get("/api/blog/page/date",{
          params:{
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            categoryName:this.current === '全部博客' ? null:this.current
          }
        }).then(res=>{
          this.total = res.data.total
          this.tableData = res.data.list
          console.log(this.tableData)
        })
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key
    },
    // 选择不同排序
    sortBywhat(keyPath){
      this.tableData = null // 将数据清空
      const loading = this.$loading({
          lock: true,
          text: '正在加载',
          spinner: 'el-icon-loading',
          // background: 'rgba(0, 0, 0, 0.7)',
          target: document.querySelector('.right')
        });
        setTimeout(() => {
          loading.close();
          // 选择浏览量排序
          if(keyPath === 1){
              API.get("/api/blog/page/readCount",{
              params:{
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                categoryName:this.current === '全部博客' ? null:this.current
              }
            }).then(res=>{
              this.total = res.data.total
              this.tableData = res.data.list
              console.log(this.tableData)
              console.log(this.activeIndex)
            })
          }
          // 选择发布时间排序
          if(keyPath === 2){
              API.get("/api/blog/page/date",{
              params:{
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                categoryName:this.current === '全部博客' ? null:this.current
              }
            }).then(res=>{
              this.total = res.data.total
              this.tableData = res.data.list
              console.log(this.tableData)
              console.log(this.activeIndex)
            })
          }
        }, 1000);
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
    // 点击标题跳转到博客详细页面
    skipDetails(BlogId,categoryId){
      const loading = this.$loading({
        lock: true,
        text: '页面正快马加鞭赶来，请稍等...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 1)'
      });
      setTimeout(() => {
        loading.close();
        router.push({
          path:'./details',
          query:{id:BlogId,categoryId:categoryId} //将博客ID、博客分类ID传到博客详细页
      })
      }, 1500);
      
      sessionStorage.setItem("current",this.current) // 将此时选择的博客分类存入
      sessionStorage.setItem("activeIndex",this.activeIndex) // 将此时选择的排序类型存入
    },
    scrollToTop() {
      // 使用原生JavaScript方法将滚动条滚动到顶部
      window.scrollTo({
        top:0,
        left:0,
        behavior: 'smooth' // 缓慢上升
      });
    }
  },
};
</script>

<style scoped>
/* .home{
  width: 1500px;
} */
  /* 具体内容区域 */
  .Topimg {
    margin-top: 10px;
    overflow: hidden;
  }

  .Topimg img {
    transform: translateY(-45%);
  }

  .content {
    /* display: flex; */
    margin-top: 10px;
  }

  .text-item {
    font-size: 18px;
    text-align: center;
    padding: 14px 0;
    cursor: pointer;
  }

  .text-item:hover{
    background-color: #409EFF;
  }

  .text-item-active {
    background-color: #409EFF;
    color: #fff;
    border-radius: 5px;
  }
  

  .box-card {
    width: 200px;
    margin-bottom: 200px;
  }

  .right {
    /* background-color: #409EFF; */
    /* height: 200px; */
    width: 780px;
    /* margin-left: 10px; */
    margin-bottom: 50px;
  }

  .right .recommend{
    margin-bottom: 10px;
  }

  .card{
    border-top: 1px solid #666;
    cursor: pointer;
  }

  .card:hover{
    background-color: #eeeeee;
  }

  .right img {
    width:300px;
    height: 200px;
  }

  .rightCard {
    margin-left: 10px;
  }

  .line1 {
    width: 430px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .line2{
    margin: 15px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .line2 span {
    color: #666;
  }
  .line2 span:hover{
    color: #409EFF;
  }

  .advert {
    cursor: pointer;
    overflow: hidden;
    /* margin-left: 10px; */
    margin-top: 10px;
    width: 260px;
  }

  .advert img {
    transition: transform 0.5s ease;
    height: 100%;
    width: 100%;
  }

  .advert:hover img{
    transform: scale(1.2)
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
