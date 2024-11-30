<template>
    <div >
        <el-card style="margin-bottom: 100px;">
            <div style="font-size: 26px;margin-bottom: 20px;text-align: center;">{{ this.blogId ?  '修改博客数据' : '发布新博客'}}</div>
            <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="descr">
                    <el-input type="textarea" v-model="form.descr" placeholder="简介"></el-input>
                </el-form-item>
                <el-form-item label="封面" prop="cover">
                    <el-upload
                        :action="$baseUrl + '/files/upload'"
                        :headers="{ token: user.token }"
                        list-type="picture"
                        :on-success="handleCoverSuccess"
                    >
                    <el-button type="primary">上传封面</el-button>
                    </el-upload>
                    <el-image style="width: 500px; height: 300px; border-radius: 5px;margin-top: 10px;" v-if="form.cover"
                                        :src="$baseUrl + '/files/' + form.cover" :preview-src-list="[$baseUrl + '/files/' + form.cover]"></el-image>
                </el-form-item>
                <el-form-item label="分类" prop="categoryId">
                    <el-select v-model="form.categoryId" style="width: 100%">
                        <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签" prop="tags">
                    <el-select v-model="tagsArr" multiple filterable allow-create default-first-option style="width: 100%">
                    <el-option value="多彩校园"></el-option>
                    <el-option value="学生活动"></el-option>
                    <el-option value="公益活动"></el-option>
                    <el-option value="学习经验"></el-option>
                    <el-option value="校园新闻"></el-option>
                    <el-option value="大数据"></el-option>
                    <el-option value="实习"></el-option>
                    <el-option value="社团活动"></el-option>
                    <el-option value="二手交易"></el-option>
                    <el-option value="饮食攻略"></el-option>
                    <el-option value="大学生活"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <div id="editor"></div>
                </el-form-item>
                <el-form-item>
                    <div>
                        <el-button type="primary" size="medium" @click="save">{{ this.blogId ?  '确认修改' : '确认发布'}}</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>


<script>
import API from '../../utils/request'
import E from "wangeditor"
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

const url = "/api/blog/"

export default{
    name:'Blog',
    data(){
        return{
            form:{}, // 表单数据
            rules: { // 与<el-form:rules="rules">form表单的父元素绑定
                title: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请输入标题', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
                descr: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请输入简介', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
                cover: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请上传封面', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
                categoryId: [  //与<el-form-item prop="name">用户名的表单子元素项进行绑定
                    {required: true, message: '请选择分类', trigger: 'blur'}, // 给打开的弹窗写校验规则
                ],
            }, 
            tagsArr:[], // 打开弹窗中标签的数据
            user: JSON.parse(sessionStorage.getItem('user') || '{}'),
            categoryList:[], // 打开弹窗中分类的数据：从category表中获取
            title: null,
            editor: null,
            content: '', // 点击查看内容时对其赋值
            blogId:0
        }
    },
    created() {
        this.load()
        this.setRichText()
    },
    methods: {

        // 访问$baseUrl + '/files/upload'后将照片的名字返回
        handleCoverSuccess(res) {
            this.form.cover = res.data
            console.log(res.data)
        },

        // 重置功能
        reset() {
            this.input4 = null
            this.load()
        },

        // 创建富文本
        setRichText() {
            this.$nextTick(() => {
                    this.editor = new E(`#editor`)
                    this.editor.highlight = hljs
                    this.editor.config.uploadImgServer = this.$baseUrl + '/files/editor/upload' // 富文本文件上传
                    this.editor.config.uploadVideoServer = this.$baseUrl + '/files/uploadVideo' // 视频文件上传
                    this.editor.config.uploadVideoHooks = { // 重写视频上传
                        customInsert: function (insertVideo, result) {
                            console.log(result.data[0].url)
                            insertVideo(result.data[0].url)
                        }
                    }
                    this.editor.config.uploadFileName = 'file'
                    this.editor.config.uploadVideoName = 'video'
                    this.editor.config.showLinkVideo = false
                    this.editor.config.uploadImgHeaders = {
                        token: this.user.token
                    }
                this.editor.config.uploadImgParams = {
                    type: 'img',
                }
                this.editor.config.zIndex = 0
                this.editor.create()  // 创建
                console.log(this.editor.config)
            })
        },

        // 获取数据以及换页功能
        load(){
            // 获取url中的blogId
            var afterUrl =  window.location.search.substring(1);
            this.blogId = afterUrl.split("=")[1]
            console.log(afterUrl)
            console.log(this.blogId)

            API.get('/api/category').then(res => {
                console.log(res.data)
                this.categoryList = res.data || []
            })
            // 如果是编辑博客即获取原有的数据
            if(this.blogId){
                API.get('/api/blog/' + this.blogId).then(res => {
                this.form = res.data
                this.tagsArr = JSON.parse(this.form.tags) // 给标签赋值
                this.editor.txt.html(this.form.content) // 给内容赋值
                console.log(this.form)
            })
            }
        },

        // 保存
        save(){
            this.$refs.formRef.validate((valid) => {
            if (valid) {
                this.form.tags = JSON.stringify(this.tagsArr) // 此时的tagsArr是JSON数组，提交时将tagsArr转成JSON字符串并存到数据库
                this.form.content = this.editor.txt.html()
                this.form.userId = this.user.id
                // 根据是发布还是修改选择不同的提示语
                if(!this.blogId){
                this.$confirm('您确定发布吗？', '确认发布', {type: "success"}).then(response => {
                API.request({
                    url: '/api/blog/save',
                    method: 'POST',
                    data: this.form
                }).then(res => {
                    if (res.code === '200') {  // 表示成功保存
                        this.$message.success('发布成功,等待管理员审核')
                        this.$router.push('./personPage')
                        this.load()
                    } else {
                        this.$message.error(res.msg)  // 弹出错误的信息
                    }
                })
            })
            }else{
                this.$confirm('您确定修改吗？', '确认修改', {type: "info"}).then(response => {
                    API.request({
                        url: '/api/blog/update',
                        method: 'PUT',
                        data: this.form
                    }).then(res => {
                        if (res.code === '200') {  // 表示成功保存
                            this.$message.success('修改成功，等待管理员审核')
                            this.$router.push('./personPage')
                            this.load()
                        } else {
                            this.$message.error(res.msg)  // 弹出错误的信息
                        }
                    })
                })
            }
        }
        })   
        },
    }
}
</script>

<style>

</style>