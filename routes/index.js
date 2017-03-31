var express = require('express');
var router = express.Router();
var db_tools = require('../mongo/db_tools');
var upload = require('./uploader');
/* GET home page. */
router.get('/', (req, res) => {
    res.render('login');
});

router.get('/projectList', (req, res) => {
    res.render('project/projectList');
});

/**
 * 新增项目
 */
router.post('/api/addProject', (req, res) => {
    db_tools.add('project', req.body).then(() => {
        res.send({
            success: true,
            data: null,
            message: '新增项目成功'
        })
    }, (err) => {
        console.error(err);
        res.send({
            success: false,
            data: null,
            message: '新增失败，请重试'
        })
    })
});

/**
 * 编辑项目信息
 */
router.post('/api/editProject', (req, res) => {
    db_tools.edit('project', req.body).then(() => {
        res.send({
            success: true,
            data: null,
            message: '新增项目成功'
        })
    }, (err) => {
        console.error(err);
        res.send({
            success: false,
            data: null,
            message: '修改失败，请重试'
        })
    })
});

/**
 * 获取项目列表
 */
router.get('/api/getProjectList', (req, res) => {
    db_tools.query('project', req.query).then((data) => {
        res.send(data);
    }, (err) => {
        console.error(err);
        res.send({
            success: false,
            data: null,
            message: '获取数据失败，请重试'
        })
    })
});

/**
 * 删除项目
 */
router.get('/api/delProject', (req, res) => {
    db_tools.remove('project', req.body._id).then((data) => {
        res.send({
            success: true,
            data: null,
            message: '删除成功'
        })
    }, (err) => {
        console.error(err);
        res.send({
            success: false,
            data: null,
            message: '删除失败，请重试'
        })
    })
});

router.post('/api/score', (req, res) => {
    db_tools.pushSubDoc('project', {_id: req.body.projectId}, {score:{score: req.body.score,username:req.body.username}}).then(() => {
        res.send({
            success: true,
            data: null,
            message: '打分成功'
        })
    }, (err) => {
        res.send({
            success: false,
            data: null,
            message: '打分失败，请重试'
        })
    })
});

/**
 * 文件上传
 */
router.post('/api/fileUploader', upload.uploadFile);

/**
 * 用户登录
 */

router.post('/api/login', (req, res)=> {
    var pwd = req.body.password;
    db_tools.queryByCondition('user', {username: req.body.username}).then((data)=>{
        if(data.length){
            data = data[0].toObject();
            if(data.password === pwd){
                res.send({
                    success:true,
                    data:null,
                    message:'登录成功'
                })
            }else{
                res.send({
                    success:false,
                    data:null,
                    message:'密码错误'
                })
            }
        }else{
            res.send({
                success:false,
                data:null,
                message:'用户不存在'
            })
        }
    },(err)=>{
        console.error(err);
        res.send({
            success: false,
            data: null,
            message: '登录失败'
        })
    })
});
module.exports = router;