# 直播软件

这是一个vue3+vite的直播后台
本人只是学生项目不会维护所以遇到问题请自己解决



### 安装依赖
``` 
npm install
```

### 浏览器启动命令
浏览器启动的话会失去直播捕获效果
```
npm run dev
```
### 真正启动命令
此命令是结合命令
```
npm run start
```
### 打包
通过以下命令打包 打包后的软件会出现在dists目录下
```
npm run build
```
### 开发环境
| 软件 | 版本 | 
|-------|-------|
| node | 20 |
|VMware Workstation Pro| 17 |
| centos | 7 |
| nginx | 3 |
| SRS | 6.0 |

### nginx 配置环境 
请将这些内容放入nginx的nginx.conf中需注意要配置nginx的ssl必须要https 至于srs安装请参考srs的官方文档
```
     location ~ ^/(console|players)/ {
           proxy_pass http://127.0.0.1:8080/$request_uri;
        }
        # For SRS streaming, for example:
        #   http://r.ossrs.net/live/livestream.flv
        #   http://r.ossrs.net/live/livestream.m3u8
        location ~ ^/.+/.*\.(flv|m3u8|ts|aac|mp3)$ {
           proxy_pass http://127.0.0.1:8080$request_uri;
        }
        # For SRS backend API for console.
        # For SRS WebRTC publish/play API.
        location ~ ^/(api|rtc)/ {
           proxy_pass http://127.0.0.1:1985$request_uri;
        }
```
