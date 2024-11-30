<template>
    <div class="main">
        <!-- 搜索框区域 -->
        <div class="input">
          <el-card shadow="always">
            <el-input
            v-model="input4"
            style="width: 240px"
            placeholder="请输入标题进行查询"
            
            >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button type="primary" size="medium" @click="load">查询</el-button>
            <el-button type="warning" size="medium" @click="reset">重置</el-button>
          </el-card>
        </div>
        <!-- 新增与批量删除区域 -->
        <div class="button">
          <el-card shadow="always">
            <el-button type="primary" size="medium" plain @click="handleAdd">新增</el-button>
            <el-button type="danger" size="medium" plain @click="removeByIds">批量删除</el-button>
          </el-card>
        </div>
        <!-- 具体内容区域 -->
        <el-main>
          <el-card shadow="always">
            <el-scrollbar height="100%">
                <el-table
                    ref="multipleTableRef"
                    :data="tableData"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="序号" property="id" width="120" sortable/>
                    <el-table-column property="title" label="标题" show-overflow-tooltip />
                    <el-table-column property="descr" label="简介" show-overflow-tooltip />
                    <el-table-column label="内容">
                        <template v-slot="scope">
                            <el-button type="primary" @click="preview(scope.row.content)">查看</el-button>
                        </template>
                    </el-table-column> 
                    <el-table-column property="cover" label="封面"  >
                        <template v-slot="scope">
                            <div style="display: flex; align-items: center">
                            <el-image style="width: 50px; height: 50px; border-radius: 5px" v-if="scope.row.cover"
                                        :src="$baseUrl + '/files/' + scope.row.cover" :preview-src-list="[$baseUrl + '/files/' + scope.row.cover]"></el-image>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column property="categoryName" label="分类"  />
                    <el-table-column prop="tags" label="标签">
                        <template v-slot="scope">
                            <el-tag v-for="item in JSON.parse(scope.row.tags || '[]')" :key="item" style="margin-right: 5px">{{ item }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column property="userName" label="发布人"  />
                    <el-table-column property="date" label="发布日期" show-overflow-tooltip />
                    <el-table-column property="readCount" label="浏览量"  />
                    <el-table-column label="操作" width="300px" align="center">
                        <template #default="scope">
                            <el-button type="info" size="medium" circle @click="audit(scope.row.id)" v-if="scope.row.status === '待审核'"><i class="iconfont icon-shenhe"></i></el-button>
                            <el-button type="primary" size="medium" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                            <el-button type="danger" size="medium" icon="el-icon-delete" circle @click="removeById(scope.row.id)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
          </el-card>  
        </el-main>

        <!-- 分页功能 -->
        <div style="margin-top: 10px">
            <el-pagination
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

        <!-- 文章内容弹窗 -->
        <el-dialog title="文章内容" :visible.sync="fromVisible1" width="50%" :close-on-click-modal="false" destroy-on-close>
            <div class="w-e-text">
                <div v-html="content"></div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="fromVisible1 = false">关 闭</el-button>
            </div>
        </el-dialog>
  
        <!-- 弹窗 -->
        <el-dialog title="信息" :visible.sync="fromVisible" width="60%" :close-on-click-modal="false" destroy-on-close>
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
                    <el-image style="width: 200px; height: 100px; border-radius: 5px;margin-top: 10px;" v-if="form.cover"
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="fromVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>


<script>
import API from '../../utils/request'
import E from "wangeditor"
import hljs from 'highlight.js'

const url = "/api/blog/"

export default{
    name:'Blog',
    data(){
        return{
            tableData:[], //具体内容数据
            input4:"", //搜索框数据
            pageNum: 1, //分页的第几页数据
            pageSize: 10, //分页的一页有几条数据
            total: 0, //一个有几条数据
            form:{}, // 表单数据
            fromVisible:false, //修改以及新增窗体是否打开
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
            ids:[],
            tagsArr:[], // 打开弹窗中标签的数据
            user: JSON.parse(sessionStorage.getItem('user') || '{}'),
            categoryList:[], // 打开弹窗中分类的数据：从category表中获取
            title: null,
            editor: null,
            content: '', // 点击查看内容时对其赋值
            fromVisible1: false // 点击查看内容将值变为true，即打开内容弹窗
        }
    },
    created() {
        this.load()
    },
    methods: {
        audit(id){
            this.$confirm('您确定审核通过吗？', '确认', {type: "warning"}).then(response => {
                API.get(url + 'audit/' + id).then(res => {
                    if(res.code === '200'){
                        this.$message({
                            type: "success",
                            message: "审核成功"
                        })
                    }else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    })
                    }
                    this.load()
                })
            })
        },

        // 访问$baseUrl + '/files/upload'后将照片的名字返回
        handleCoverSuccess(res) {
            this.form.cover = res.data
            // this.$refs.form.validateField('cover');
            console.log(res.data)
        },

        // 点击查看
        preview(content) {
            this.content = content // 给其中的内容赋值
            this.fromVisible1 = true // 打开弹窗
        },

        // 重置功能
        reset() {
            this.input4 = null
            this.load()
        },

        // 打开新增数据框
        handleAdd(){ 
            this.form = {} // 新增数据的时候清空数据
            this.tagsArr = []
            this.fromVisible = true // 打开弹窗
            this.setRichText()
        },

        // 打开修改数据框
        handleEdit(row){
            this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据
            this.fromVisible = true // 打开弹窗
            this.tagsArr = JSON.parse(this.form.tags) // 此时的tagsArr是JSON字符串，点击此按钮时将tagsArr转成JSON数组并在页面展示
            this.setRichText() 
            setTimeout(() => {
                this.editor.txt.html(this.form.content) // 给弹窗赋值
            }, 0)
            console.log(row)
            console.log(this.tagsArr)
        },

        // 创建富文本
        setRichText() {
            console.log(this.user)
            this.$nextTick(() => {
                    this.editor = new E(`#editor`)
                    this.editor.highlight = hljs
                    this.editor.config.uploadImgServer = this.$baseUrl + '/files/editor/upload' // 富文本文件上传
                    this.editor.config.uploadFileName = 'file'
                    this.editor.config.uploadImgHeaders = {
                        token: this.user.token
                    }
                this.editor.config.uploadImgParams = {
                    type: 'img',
                }
                this.editor.create()  // 创建
                console.log(this.editor.config)
            })
        },

        // 获取数据以及换页功能
        load(){
            
            API.get(url + "/page", {
            params: {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                title: this.input4,
            }
        }).then(res => {
            this.tableData = res.data.list || []
            this.total = res.data.total
            console.log(this.tableData)
        }),
            API.get('/api/category').then(res => {
                console.log(res.data)
                this.categoryList = res.data || []
            })
        },

        // 保存
        save(){
            this.$refs.formRef.validate((valid) => {
            if (valid) {
                this.form.tags = JSON.stringify(this.tagsArr) // 此时的tagsArr是JSON数组，提交时将tagsArr转成JSON字符串并存到数据库
                this.form.content = this.editor.txt.html()
                API.request({
                    url: this.form.id ? '/api/blog/update' : '/api/blog/save',
                    method: this.form.id ? 'PUT' : 'POST',
                    data: this.form
                }).then(res => {
                    if (res.code === '200') {  // 表示成功保存
                        this.$message.success('保存成功')
                        this.load()
                        this.fromVisible = false
                    } else {
                        this.$message.error(res.msg)  // 弹出错误的信息
                    }
                })
            }
        })
        },

        // 单个删除
        removeById(id){
            this.$confirm('您确定删除吗？', '确认删除', {type: "error"}).then(response => {
                API.delete(url + '/remove/' + id).then(res => {
                    if(res.code === '200'){
                        this.$message({
                            type: "success",
                            message: "删除成功"
                        })
                    }else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    })
                    }
                    this.load()
                })
            })
        },

        // 将选中的id给数组ids
        handleSelectionChange(rows) {
            console.log(rows)
            this.ids = rows.map(v => v.id)
            console.log(this.ids)
        },
        
        // 批量删除
        removeByIds() {   
            if (!this.ids.length) {
                this.$message.warning('请选择数据')
                return
            }
            this.$confirm('您确定批量删除这些数据吗？', '确认删除', {type: "warning"}).then(response => {
                API.delete(url + '/remove/ids', {data: this.ids}).then(res => {
                if (res.code === '200') {   // 表示操作成功
                    this.$message.success('操作成功')
                    this.load(1)
                } else {
                    this.$message.error(res.msg)  // 弹出错误的信息
                }
                })
            }).catch(() => {
            })
        },
        // 设置一页多少条数据
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.load()
        },

        // 换页功能
        handleCurrentChange(pageNum) {
            this.pageNum = pageNum
            this.load()
        },
    }
}
</script>

<style>
.demo-pagination-block  {
  /* margin-top: 10px; */
  margin-left: 20px;
}
.el-button {
  margin-left: 10px;
}
.el-table .el-table-column:last-child {
    width: 50px;
}
.top .el-checkbox:last-of-type {
    margin-right: 50px;
}
.input .el-card{
    background-color: #fff;
    margin-left: 20px;
    margin-right: 20px;
    /* height: 50px; */
    /* line-height: 50px; */
    padding-left: 10px;
    box-sizing: border-box;
}
.button .el-card{
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    background-color: #fff;
    /* height: 60px; */
    padding-left: 10px;
}
.el-table .cell {
    font-size: 16px;
}
</style>: any: any: { data: any; }: any: any: string(: any): any[](: { id: any; })(: any)