<template>
    <div class="footer">
        <div class="w">
            <div class="footer-link">
                <ul>
                    <li class="header">关于我们</li>
                    <li>公司简介</li>
                    <li>团队介绍</li>
                    <li>开发者社区</li>
                </ul>
                <ul>
                    <li class="header">服务条款与隐私政策</li>
                    <li>服务条款</li>
                    <li>隐私政策</li>
                    <li>使用须知</li>
                </ul>
                <ul>
                    <li class="header">帮助与支持</li>
                    <li>帮助中心</li>
                    <li>联系我们</li>
                    <li>反馈与建议</li>
                </ul>
                <ul>
                    <li class="header">友情链接</li>
                    <li>学校官网</li>
                    <li>图书馆</li>
                    <li>在线学习平台</li>
                </ul>
            </div>


    <div class="power">
        <div class="f1">
            <div style="margin-bottom: 10px;">© 2024 校园博客论坛系统. 保留所有权利。</div>
            <div style="margin-bottom: 10px;">czf 版权所有。</div>
            <div>由 [czf个人] 提供技术支持</div>
            <div>Powered by [开发框架：Spring Boot] + [前端框架，Vue.js]</div>
        </div>
    </div>
</div>


    
    </div>
</template>


<script>
    export default {
        name: "Footer",
    };
</script>


<style>

.footer{
    width: 100%;
    height: 370px;
    background-color: #e3eef5;
    float: left;
    position: relative;
    
}
.w{
    width: 1024px;
    margin: 0 auto;
}
.footer-link{
    padding: 30px 0 15px;
    border-bottom: #d3dde4 1px solid;
    height: 260px;
    text-align: center;
}
.footer-link>ul{
    float: left;
    width: 25%;
}
.footer-link>ul>li.header {
    font-size: 16px;
    font-weight: bold;
    color: #323232;
    line-height: 64px;
    padding: 5px 0;
}
ul, li, ol {
    margin: 0;
    padding: 0;
    line-height: 32px;
    list-style: none;
}
.footer-link>ul>li a{
    font-size: 14px;
    color: #666;
    line-height: 24px;
}
.power{
    overflow: hidden;
    /* line-height: 52px; */
    color: #666;
}
.f1{
    /* float: left; */
    text-align: center;
}
</style>