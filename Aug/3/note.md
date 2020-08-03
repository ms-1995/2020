### 浏览器缓存策略

* 强缓存: 设置`Expires`/设置`Cache-Control`（过期时间）

* 协商缓存: `Last-Modified`/`Etag`（最后修改时间时间）

### 网络

#### OSI模型

物理层，数据链路层，网络层，传输层，会话层，表示层，应用层

#### HTTP状态码

* 2xx 请求成功
* 3xx 重定向
* 4xx 客户端错误
* 5xx 服务端错误

#### GET请求和POST请求

* GET请求参数在URL上，POST放在请求体中
* GET请求参数长度有限制
* POST更安全
* GET能缓存

#### HTTP和HTTPS区别

* HTTPS使用443端口，HTTP使用80
* HTTPS需要申请证书
* HTTP是超文本传输协议，是明文传输；HTTPS是经过SSL加密的协议，传输更安全
* HTTPS比HTTP要慢，因为除了TCP传输外，还要加上SSL握手的九个包
