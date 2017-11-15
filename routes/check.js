const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require('../config');
const status = require('../server/shared/status');
const colors = require('colors');

/* GET home page. */
router.post('/', function (req, res, next) {
  const token = req.headers.token;  
  // console.log('***********'.yellow);
  // console.log(token);
  // console.log('***********'.yellow);
  if (token) {
    /**
     * @description 同步/异步验证 token 的同时，给 token 续期
     * jwt.verify(token, secretOrPublicKey, [options, callback])
     * @param token 客户端传过来的验证 token
     * @param secretOrPublicKey 配置文件里面的密钥
     * @param options 一大堆的验证细节，暂时用到 maxAge 用来给 token 延期
     * @param callback 回调里面有2个参数，一个是 token 是否有效，一个是解码 payload（例如签发 token 的时候我填的 username）  
     */
    // try {
    //   const decoded = jwt.verify(token, config.secret, { maxAge: 30 });
    // } catch(err) {
    //   if (err) {
    //     // 时间失效、伪造 => 超时（需要重新登录）
    //     res.send(status.timeout());
    //   } else {
    //     res.send(status.success());
    //   }
    // }

    jwt.verify(token, config.secret, { maxAge: '2 days' }, function (err, decoded) {
      console.log('***********'.green);
      console.log(err);
      console.log('***********'.green);
      if (err) {
        // 时间失效、伪造 => 超时（需要重新登录）
        res.send(status.timeout());
      } else {
        res.send(status.success());
      }
    });

  } else {
    res.send(status.error());
  }
});

module.exports = router;