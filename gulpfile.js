var lr         = require('tiny-lr'),
    server     = lr(),
    gulp       = require('gulp'),
    livereload = require('gulp-livereload'), //修改文件自動刷新，可替代方案：gulp-connect
    uglify     = require('gulp-uglify'),     //js压缩工具
    plumber    = require('gulp-plumber'),    //可在程序出错后继续保持运行状态
    webserver  = require('gulp-webserver'),  //web服务器
    opn        = require('opn'),             //自动打开浏览器完成请求
    concat     = require('gulp-concat'),     //JS合并
    clean      = require('gulp-clean'),      //清除无用文件
    imagemin   = require('gulp-imagemin'),   //压缩图片
    pngquant   = require('imagemin-pngquant'), //png深度压缩
    rename     = require("gulp-rename"),     //重命名
    zip        = require('gulp-zip'),        //压缩
    copy       = require("gulp-copy"),       //拷贝
    sftp       = require('gulp-sftp'),       //sftp协议
    config     = require('./config.json'),   //配置文件
    htmlmin    = require('gulp-htmlmin'),    //html压缩
    minifycss = require('gulp-minify-css');  //css压缩

//项目目录配置(项目名称及路径可数组自由配置)
var baseIn = "app/",

    baseOut = "build/",

    //无需压缩的文件
    originalPath=[
        [baseIn+"originalPath/**",baseOut+"originalPath/"]
    ],

    oCssPath =[
        [baseIn+"css/**",baseOut+"css/"]
    ],

    oJsPath = [
        [baseIn+"js/**",baseOut+"js/"]
    ],

    oImgPath =[
        [baseIn+"images/**",baseOut+"images/"]
    ],

    oHtmlPath =[
        [baseIn+"html/**",baseOut+"html/"]
    ],

    aCleanPath = [baseOut];

//压缩css文件
gulp.task("cssmin",function(){
    for(var i=0;i<oCssPath.length;i++){
        gulp.src(oCssPath[i][0]).pipe(minifycss()).pipe(gulp.dest(oCssPath[i][1]));
    }
});
//压缩html
gulp.task("htmlmin",function(){
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    }
    for(var i=0;i<oHtmlPath.length;i++){
        gulp.src(oHtmlPath[i][0]).pipe(htmlmin(options)).pipe(gulp.dest(oHtmlPath[i][1]));
    }
});

//源文件输出
gulp.task("original",function(){

    for(var i=0;i<originalPath.length;i++){
        gulp.src(originalPath[i][0]).pipe(gulp.dest(originalPath[i][1]));
    }
});

//压缩javascript 文件，压缩后文件放入build/js下   
gulp.task('minifyjs',function(){
    for(var i=0;i<oJsPath.length;i++){
        gulp.src(oJsPath[i][0]).pipe(uglify()).pipe(gulp.dest(oJsPath[i][1]));
    }
});
//压缩图片
gulp.task('imagemin', function () {

    for(var i=0;i<oImgPath.length;i++){
        gulp.src(oImgPath[i][0]).pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })).pipe(gulp.dest(oImgPath[i][1]));
    }

});

//合并build/js文件夹下的所有javascript 文件为一个main.js放入build/js下   
gulp.task('alljs', function() {
  return gulp.src('./build/js/*.js')
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('./build/js/'));
});

//重命名project.md 描述文件
gulp.task('rename', function() {
  return gulp.src("./Project.md")
      .pipe(rename("README.md"))
      .pipe(gulp.dest("./build")); 
});

//开启本地 Web 服务器功能
gulp.task('webserver', function() {
  gulp.src( './' )
    .pipe(webserver({
      host:             config.localserver.host,
      port:             config.localserver.port,
      livereload:       true,
      directoryListing: false
    }));
});

//通过浏览器打开本地 Web服务器 路径
gulp.task('openbrowser', function() {
  opn( 'http://' + config.localserver.host + ':' + config.localserver.port );
});


//多余文件删除(待配置)
//gulp.task('clean', function () {
//    return gulp.src('./.sass-cache')
//        .pipe(clean({force: true}))
//        .pipe(gulp.dest('./clean'));
//});




//将相关项目文件复制到build 文件夹下
gulp.task('buildfiles', function() {
   //根目录文件
   gulp.src('./*.{php,html,css,png}')
   .pipe(gulp.dest('./build'));

});

//文件监控
gulp.task('watch', function () {

  server.listen(35729, function (err) {
    if (err){
      return console.log(err);
    }
  });
  gulp.watch(['./*.html','./*.php','./*.css','./js/*.js'],  function (e) {
    server.changed({
      body: {
        files: [e.path]
      }
    });
  });
 
});

//默认任务 (用于开发)
gulp.task('default', function(){
  console.log('Starting Gulp tasks, enjoy coding!');
  gulp.run('watch');
  gulp.run('webserver');
  gulp.run('openbrowser');
});

//项目完成提交任务
gulp.task('build', function(){
  gulp.run('original');
  gulp.run('cssmin');
  gulp.run('htmlmin');
  gulp.run('imagemin');
  gulp.run('minifyjs');
  gulp.run('alljs');
  gulp.run('buildfiles');
  gulp.run('rename');
  //gulp.run('clean');
});


//打包主体build 文件夹并按照时间重命名
gulp.task('zip', function(){
      function checkTime(i) {
          if (i < 10) {
              i = "0" + i
          }
          return i
      }
          
      var d=new Date();
      var year=d.getFullYear();
      var month=checkTime(d.getMonth() + 1);
      var day=checkTime(d.getDate());
      var hour=checkTime(d.getHours());
      var minute=checkTime(d.getMinutes());

  return gulp.src('./build/**')
        .pipe(zip( config.project+'-'+year+month+day +hour+minute+'.zip'))
        .pipe(gulp.dest('./'));
});

//上传到远程服务器任务
gulp.task('upload', function () {
    return gulp.src('./build/**')
        .pipe(sftp({
            host: config.sftp.host,
            user: config.sftp.user,
            port: config.sftp.port,
            key: config.sftp.key,
            remotePath: config.sftp.remotePath
        }));
});