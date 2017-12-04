const express = require('express');
const router = express.Router();
const Comment = require('../../server/models/comment');
const User = require('../../server/models/user');
const dao = require('../../server/dao');
const status = require('../../server/shared/status');

// 状态-添加评论
const addStatus = {
    someEmpty: {
        code: '4001',
        msg: '操作失败，请检查必填项',
        data: null
    },
    findUserDataError: {
        code: '4002',
        msg: '操作失败，查找用户ID失败',
        data: null
    },
    insertCommentError: {
        code: '4003',
        msg: '操作失败，插入文章评论失败',
        data: null
    }
};

/**
 * @description 添加评论
 */
router.post('/', function (req, res) {

    const articalId = req.body.articalId;
    const commentContent = req.body.content;

    // 如果有必填项没有填，返回错误
    if (!(articalId && commentContent)) {
        res.send(addStatus.someEmpty);
        return;
    }

    // step1: 根据 tokenDecoded 查到用户的 id 
    const username = req.tokenDecoded.username;
    dao.findOne(User, { username })
    .then((data) => {

        const commentData = {
            articalId: articalId,
            comment_user_id: data._id,
            comment_content: commentContent
        };

        // step2: 插入评论集合 
        dao.insert(new Comment(commentData))
        .then(() => {
            res.send(status.success(null));
        })
        .catch((err) => {
            console.log('插入文章评论失败：' + err);
            res.send(addStatus.insertCommentError);
        });

    })
    .catch((err) => {
        console.log('查询用户ID失败：' + err);
        res.send(addStatus.findUserDataError);
    });

});

module.exports = router;