const router = require('koa-router')();

const userModel = require('../lib/mysql.js');

const check = require('../config/check.js');

const moment = require('moment');

module.exports = {
    'POST /api/users/signup': async (ctx, next) => {
        ctx.response.type = 'application/json';
        // console.log(ctx.request.body);
        const user = {
            name: ctx.request.body.name,
            pswd: ctx.request.body.pswd,
            repeatpass: ctx.request.body.repeatpass
        }
        await userModel.findDataByName(user.name)
            .then(result => {
                console.log('查找结果： ' + result.length)
                if (result.length > 0) {
                    try {
                        throw Error('用户名存在');
                    } catch (error) {
                        console.log(error);
                    }
                    ctx.body = {
                        data: 1,
                        message: '用户名已存在'
                    }
                } else if (user.pswd !== user.repeatpass || user.pswd === '') {
                    ctx.body = {
                        data: 2,
                        message: '密码不一致'
                    };
                } else {
                    console.log('注册成功');
                    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    console.log(createTime)
                    userModel.insertData([ctx.request.body.name, ctx.request.body.pswd, 2, createTime]);
                    ctx.response.body = {
                        data: 3,
                        result: result
                    };
                }
            })
            .catch(err => console.log(err))
    },

    'POST /api/users/signin': async (ctx, next) => {
        console.log('facccccccccc')
        console.log(ctx.request.body);
        let name = ctx.request.body.name,
            pswd = ctx.request.body.pswd

        await userModel.findDataByName(name)
            .then(result => {
                // console.log(result); //这是数据库返回的数据
                const res = JSON.parse(JSON.stringify(result))
                // console.log(res) //
                if (name === res[0]['name'] && pswd === res[0]['pswd']) {
                    console.log(res[0]['id'] + '.....')
                    ctx.session.user = res[0]['name']
                    ctx.session.id = res[0]['id']
                    console.log(`session.id ${ctx.session.id}`)
                    // ctx.redirect('/posts')
                    console.log('session ' + ctx.session)
                    console.log('登录成功')
                    const token = check.signToken(name, ctx.session.id);
                    ctx.body = {
                        data: 1,
                        code: 200,
                        message: '登录成功!',
                        token
                    }
                } else {
                    ctx.body = {
                        data: 2,
                        message: '用户名或密码错误!'
                    }
                }
            })
            .catch(error => {
                console.log(error)
                ctx.body = {
                    data: 3,
                    message: error
                }
                console.log('有异常')
                // ctx.redirect('/signin')
            })
    },

    'GET /api/users/signout': async (ctx, next) => {
        console.log('登出成功');
        ctx.body = 'true'
    },

    'GET /api/users': async (ctx, next) => {  // 这里应该写成/api/users/:user_id
        let username = ''
        await check.checkToken(ctx)
            .then(res => {
                username = res.name;
                id = res.id;
            })
            .catch(err => console.log(err));

        await userModel.findDataByName(username)
            .then(result => {
                const res = JSON.parse(JSON.stringify(result))
                ctx.body = res
            })
            .catch(err => console.log(err));
    },

    'POST /api/users/posts/:user_id': async (ctx, next) => {  // 发表个人动态
        const
            post = {
                content: ctx.request.body.content,
                name: ctx.request.body.name,
                user_id: ctx.request.body.user_id
            },
            createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        await userModel.insertPost([
            ctx.request.body.name,
            ctx.request.body.content,
            createTime,
            ctx.request.body.user_id
        ])
            .then(result => {
                const res = JSON.parse(JSON.stringify(result))
                console.log(res)
            })
            .catch(err => console.log(err))

    },

    'GET /api/users/posts/:user_id': async (ctx, next) => {  // 获取个人动态列表
        console.log('!!!!')
        let userId = '';
        await check.checkToken(ctx)
            .then(res => {
                userId = res.id
            })
            .catch(err => console.log(err))

        const user_id = userId;
        console.log(ctx.request)
        await userModel.findPostsById(user_id)
            .then(result => {
                console.log('.....')
                const res = JSON.parse(JSON.stringify(result))
                ctx.body = res;
            })
            .catch(err => console.log(err))
    },

    'POST /api/users/posts/:post_id': async (ctx, next) => {  // 获取个人动态详情

    },

    'DELETE /api/users/posts/:post_id': async (ctx, next) => {  // 删除个人动态
        console.log(ctx.request.body)
        await userModel.deletePost(ctx.request.body.post_id)
            .then(result => {
                const res = JSON.parse(JSON.stringify(result))
                console.log(res)
                ctx.body = {
                    status: 1,
                    success: '删除动态成功'
                }
            })
            .catch(err => console.log(err))
    },

    'POST /api/users/:user_id': async (ctx, next) => {  // 修改个人资料
        // 
    },

    'GET /api/game': async (ctx, next) => {  // 获取游戏列表
        await userModel.findGameList()
            .then(res => {
                console.log(res)
                ctx.body = {
                    status: 1,
                    success: '获取首页数据成功',
                    data: res
                }
            })
            .catch(err => console.log(err))
    },

    'GET /api/category': async (ctx, next) => {  // 获取游戏种类
        //
    },

    'GET /api/game/:game_id': async (ctx, next) => {  // 获取游戏详情
        //
    },

    /**
     * 后台管理API
     * 
    */

    // 查询所有用户
    'GET /api/users/all': async (ctx, next) => {
        ctx.response.type = 'application/json';
        await userModel.findAllName()  // 查询数据库
            .then(result => {
                ctx.response.body = {   // 设置Response Body
                    result: result
                };
                console.log(result)
            })
            .catch(err => console.log(err));
    }
}