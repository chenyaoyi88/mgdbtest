const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId =  Schema.Types.ObjectId;

const CommentSchema = new Schema({
    // 文章 ID
    artical: {
        type: ObjectId, 
        ref: 'Artical',
        require: true
    },
    // 谁发表评论的
    from: {
        type: ObjectId, 
        ref: 'User'
    },
    // 评论给谁
    to: {
        type: ObjectId, 
        ref: 'User'
    },
    // 评论内容
    content: {
        type: String,
        require: true,
        default: ''
    },
    // 创建时间
    createTime: {
        type: String,
        default: new Date().toLocaleString()
    },
    // 更新时间
    updateTime: {
        type: String,
        default: new Date().toLocaleString()  
    }
});

CommentSchema.pre('save', function (next) {
    // 如果是新评论
    if (this.isNew) {
        this.updateTime = this.createTime= new Date().toLocaleString();
    } else {
        // 如果是编辑评论
        this.updateTime = new Date().toLocaleString();
    }
    next();
});

CommentSchema.pre('update', function (next) {
    // update 的时候触发
    this.update({}, {
        $set: {
            updateTime: new Date().toLocaleString()
        }
    });
    next();
});


// 评论的表结构
module.exports = CommentSchema;