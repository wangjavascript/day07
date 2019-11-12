const Koa = require('koa')

const app = new Koa()

const static = require('koa-static')

const path = require('path')

const query = require('./db/query')

app.use(static(path.join(process.cwd(), 'public'))) //静态资源

const bodyparser = require('koa-bodyparser')

app.use(bodyparser()) // post请求参数

const router = require('koa-router')() //路由

app.use(router.routes())
app.use(router.allowedMethods())

//查
router.get('/api/list', async ctx => {
    let data = await query('select * from userlist2')
    ctx.body = data
})

//增
router.post('/api/add', async ctx => {
    let {
        name
    } = ctx.request.body
    if (name) {
        let user = await query('select * from userlist2 where name=?', [name])
        if (user.data.length) {
            ctx.body = {
                code: 0,
                msg: '此人已存在'
            }
        } else {
            let data = await query('insert into userlist2 (name) values (?)', [name])
            if (data.msg === 'error') {
                ctx.body = {
                    code: 0,
                    msg: error
                }
            } else {
                ctx.body = {
                    code: 1,
                    msg: '添加成功'
                }
            }
        }
    } else {
        ctx.body = {
            code: 2,
            msg: '参数缺失'
        }
    }
})

//删
router.get('/api/del', async ctx => {
    let {
        id
    } = ctx.query
    if (id || id === 0) {
        try {
            await query('delete from userlist2 where id=?', [id])
            ctx.body = {
                code: 1,
                msg: '删除成功'
            }
        } catch (e) {
            ctx.body = {
                code: 0,
                msg: e.error
            }
        }
    } else {
        ctx.body = {
            code: 2,
            msg: '参数缺失'
        }
    }
})

//改
router.post('/api/edit', async ctx => {
    let { id, name,phone } = ctx.request.body
    if (id && name && phone) {
        try {
            await query('update userlist2 set name=?,phone=? where id=?', [name, phone, id])
            ctx.body = {
                code: 1,
                msg: '修改成功'
            }
        } catch (e) {
            ctx.body = {
                code: 0,
                msg: e.error
            }
        }
    } else {
        ctx.body = {
            code: 2,
            msg: '参数缺失'
        }
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log('服务启动成功')
})