### bililivePush-plugin
非常简洁易用的b站直播推送插件
本插件部分源码由[reset-qianyu-plugin](https://gitee.com/think-first-sxs/reset-qianyu-plugin)中分离出来，并由我自己的喜好进行修改，简化并优化代码结构，用于自用
### 安装
进入plugin目录
```
cd plugins
git clone https://gitee.com/HDTianRu/bililivePush-plugin
cd ..
pnpm install
```
###使用
|指令|功能|
|-------|-------|
|#设置b站ck|设置b站cookie，一般没必要|
|#订阅/取消订阅直播间+直播间room_id|如题|
|#订阅/取消订阅UP+UP的uid|同上|
|Tips|如需艾特全体，指令前加"全体"二字"|

###例子
```
#订阅直播间114514
#全体订阅UP1919810
#全体取消订阅12345
#取消订阅13579
```
