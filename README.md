
前端项目自动化工作流
====


> 该项目是基于：Gulp Bower 定制扩展的一个前端项目自动化工作流，新增了bower及其他新功能，欢迎Fork！

>


## 功能模块（插件）

> 小标题含义：功能（对应的Gulp 插件）

### Bower  管理你的客户端依赖关系

通过 .bowerrc 可配置插件包目标路径

使用 bower install package --save 能够将包安装到你的项目中，同时将依赖关系写入到 bower.json 的 dependencies 数组。

### 本地Web 服务器功能（gulp-webserver + tiny-lr）

能够让你的当前项目目录映射到Localhost 上，本功能主要是为了添加自动刷新（livereload）功能而添加。

### 网页自动刷新功能（gulp-livereload）

一旦监控到有文件改动就自动刷新页面。需要[安装相应的Chrome 扩展](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=zh-CN)配合使用。

### JS 文件合并（gulp-concat）

### JS 文件压缩（gulp-uglify）

### HTML 文件压缩（gulp-htmlmin）

### CSS  文件压缩（gulp-minify-css）

### 图片无损压缩1（gulp-imagemin）

经过实际使用发现，图片压缩略有损失，但基本无碍。

### 文件清理功能（gulp-clean）

在项目完成可以删除一些多余的文件

### 任务catch模块（gulp-plumber）

默认的 Gulp 任务在执行过程中如果出错会报错并立即停止当前工作流。使用plumber 模块可以在纠正错误后继续执行任务。

### 自动打包并按时间重命名（gulp-zip）

一般项目完成后需要整理文件并压缩以供交付使用或进行下一阶段的开发，本模块可以实现将项目文件自动打包并按时间重命名。

### 自动上传文件到远程FTP 服务器（gulp-sftp）

完成开发后，可通过本命令自动上传文件到远程FTP 服务器，以供在线调试

### 其他（gulp-copy、gulp-rename、opn）

其他杂项模块为该Gulp 添加文件复制、文件重命名、浏览器自动打开项目目录等基础功能




## 使用方法



1. 进入你的项目文件夹下`clone` 本 git 项目

		$ git clone https://github.com/yancykim/GB-Front.git

		
2. 安装相关Node 模块

	在项目文件夹目录下通过下面命令安装相关Node 模块

		npm install （所有依赖已完全配置）

3. 按照个人的项目需求，填写`Project.md `文件（`Project.md`文件在项目最终打包的时候会自动重命名为`README.md`保存在`build` 文件夹），填写`package.json` `config.json` 文件的项目名称部分。

	如果根据自身项目需要进一步的个性化，可以编辑`gulpfile.js` 文件，所有压缩项目以数组配置，自由扩展。

4. 进行相关配置（如果有需要用到相关功能）：为了安全，将重要的配置信息保存到项目目录下的一个json 文件中，名为 `config.json`，该文件示例代码如下：

		{
			"project" : "Gulp", 	
			"localserver" : {
    			"host" : "localhost",
    			"port" : "8081"
  			},
 			"sftp" : {
    			"host" : "8.8.8.8",
    			"user" : "username",
   				"port" : "22",
    			"key" : "~/.ssh/pwd",
    			"remotePath" :"/"
 			}
		}   
相关内容（项目别名、本地服务器域名+端口、ftp相关信息）请自行配置。
		
5. 然后，就基本上可以了，默认开发阶段任务（构建/插件/调试）

		$ gulp
	
6. 如果项目已经完成，可以通过`build` 命令进行项目相关文件收集，项目文件最终会汇集到项目目录下的`build` 文件夹中方面进一步操作（压缩）

		$ gulp build

7. 打包`build` 文件夹下的项目文件，会自动生成`项目别名-xxxx.zip` 的文件（`xxxx` 为打包时候的时间）供交付使用或进行下一阶段的开发（打包）

		$ gulp zip
		
8. 如果要上传到远程服务器进行线上调试，可以通过该命令自动上传（需提前在 `config.json`做好配置 ）（上传）

		$ gulp upload 





