## bililivePush-plugin

### 简洁易用的b站直播推送插件
本插件部分源码由[reset-qianyu-plugin](https://gitee.com/think-first-sxs/reset-qianyu-plugin)中分离出来，并由我自己的喜好进行修改，简化并优化代码结构，用于自用

### 安装
```
cd plugins
git clone https://gitee.com/HDTianRu/bililivePush-plugin
cd ..
pnpm install
```

### 使用
|指令|功能|
|-------|-------|
|#推送帮助|换个方式展示这些功能|
|#设置b站ck|设置b站cookie|
|#订阅/取消订阅直播间+直播间room_id|如题|
|#订阅/取消订阅UP+UP的uid|同上(一般用这个)|
|Tips|如需艾特全体，指令前加"全体"二字"|

### 例子
```
#订阅直播间114514
#全体订阅UP1919810
#全体取消订阅12345
#取消订阅13579
```

### 获取b站ck
1.启用httpcancry，reqable，proxypin等抓包工具  
2.在安卓端b站随便浏览一下  
3.搜索SESSDATA，找到值为SESSDATA=****的cookie  
4.私聊使用#设置b站ck

### 其他
交流群：[893157055](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=BWtOJkAHVX20OlQqgAIPn7UID9LtigSg&group_code=893157055)  
有问题提issue  
提交发pull request  
最后希望能给项目点个star~

#### 项目链接
听说Stars越多，更新越快哦~  
github：[https://github.com/HDTianRu/TianRu-plugin](https://github.com/HDTianRu/bililivePush-plugin)  
gitee：[https://gitee.com/HDTianRu/TianRu-plugin](https://gitee.com/HDTianRu/bililivePush-plugin)