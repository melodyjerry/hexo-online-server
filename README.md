# hexo-online-server

本插件已实现以下功能:

- 在线新建，编辑，删除post和page(默认路径)
- `hexo clean`,`hexo server`,`hexo deploy`
- 友链检测
- 源码同步

## 需求

- [Node.js](http://nodejs.org/) >= 10.0
- [Hexo](https://hexo.io/) 4.X(只测试了4.X)
- [Git](http://git-scm.com/)

## 准备工作

- 将**源码**托管到Git仓库(建议使用私人仓库)
- 配置好git, 确认可以使用以下命令进行同步:
  - `git pull`
  - `git add --all .`
  - `git commit -m "..."`
  - `git push`

## 使用

### 安装

```shell
npm install hexo-online-server
```

### 配置

1. 新建`config.json`文件, 内容如下:

    ```json
    {
        "indexPath":"/",// 自定义主页路径, 以"/"结尾
        "port": 4001,// http监听端口
        "wsPort": 4002,//websocke监听端口
        "secret":"",//用来签名session ID cookie,https://www.npmjs.com/package/express-session#secret
        "user":"",//登录用户名
        "passwordHash": "",//密码加密后的字符串
        "autoSave": 300000,//编辑文章时自动保存时间, 单位:ms, 0为不自动保存
        "flink":[],//对方的友链页面链接, 用于检测友链是否正常
        "noticeUrl":"",//当有用户登录时向`此链接+message`发送get请求，留空则不通知
        "pull":["git pull"],//同步到git命令
        "push":["git add --all .","git commit -m 'update'","git push"]//从到git同步命令
    }
    ```

2. 把`config.json`文件保存到你的博客目录以外的地方, 在`_config.yml`中添加: 

    ```yml
    onlineConfigPath: '../config.json' #`config.json`文件路径
    ```

3. 使用以下命令获取加密密码, 将得到的`passwordHash`添加到`config.json`文件:

    ```shell
    > hexo bcrypt 你的密码
    ```

4. 运行`hexo online`, 浏览器打开`http://localhost:4001/`

[更多](https://blog.hclonely.com/posts/ebe9edfc/)

## LICENSE

[MIT](https://github.com/HCLonely/hexo-online-server/blob/master/LICENSE)
