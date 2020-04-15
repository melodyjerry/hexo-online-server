# hexo-online-server

![](https://nodei.co/npm/hexo-online-server.png?downloads=true&downloadRank=true&stars=true)

本插件已实现以下功能:

- 在线新建，编辑，删除post和page(默认路径)
- `hexo clean`,`hexo server`,`hexo deploy`
- 源码同步

## 需求

- [Node.js](http://nodejs.org/) >= 10.0
- [Hexo](https://hexo.io/) 4.X(只测试了4.X)
- [Git](http://git-scm.com/)
- mac系统`close server`功能无法使用(我没有mac设备，无法测试)

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
npm install hexo-online-server -S
```

### 配置

1. 新建`config.json`文件, 内容如下:

    ```json
    {
        "indexPath": "/", // 自定义主页路径, 以"/"结尾
        "port": 4001, // http监听端口
        "wsPort": 4002, // websocke监听端口
        "secret": "", // 用来签名session ID cookie,https://www.npmjs.com/package/express-session#secret
        "user": "", // 登录用户名
        "passwordHash": "", // 密码加密后的字符串
        "autoSave": 300000, // 编辑文章时自动保存时间, 单位:ms, 0为不自动保存
        "noticeUrl": "", // 当有用户登录时向`此链接+message`发送get请求，留空则不通知
        "pull": ["git pull"], // 同步到git命令
        "push": ["git add --all .","git commit -m 'update'","git push"], // 从到git同步命令
        "ssl": false, // 是否启用SSL
        "private": { // 启用ssl需配置此项
            "key": "", // SSL证书key路径
            "crt": "" // SSL证书路径
        }
    }
    ```
    ***上面的注释要删掉！***

2. 把`config.json`文件保存到你的博客目录以外的地方, 在`_config.yml`中添加: 

    ```yml
    onlineConfigPath: '../config.json' #`config.json`文件路径
    ```

3. 使用以下命令获取加密密码, 将得到的`passwordHash`添加到`config.json`文件:

    ```shell
    hexo bcrypt 你的密码
    ```

4. 运行`hexo online`, 浏览器打开`http://localhost:4001/`

[更多](https://blog.hclonely.com/posts/ebe9edfc/#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)

## 示例

![](https://github.com/HCLonely/hexo-online-server/raw/master/example/screenshot-43-251-117-130-4001-1582783922140.png)
![](https://github.com/HCLonely/hexo-online-server/raw/master/example/screenshot-43-251-117-130-4001-hexo-1582783244973.png)
![](https://github.com/HCLonely/hexo-online-server/raw/master/example/screenshot-43-251-117-130-4001-post-1582783343049.png)

## LICENSE

[MIT](https://github.com/HCLonely/hexo-online-server/blob/master/LICENSE)
