const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')

const app = new Koa()
const router = new Router()

app.use(koaBody())

router
  .post('/sampleRun', (ctx) => {
    const { runId } = ctx.request.body
    const { sequenced } = ctx.request.body
    const { inCloud } = ctx.request.body
    const { analyzed } = ctx.request.body
    const { jobSubmitted } = ctx.request.body
    const { downloaded } = ctx.request.body
    const { converted } = ctx.request.body
    const { sequencedTime } = ctx.request.body
    const { inCloudTime } = ctx.request.body
    const { analyzedTime } = ctx.request.body
    const { jobSubmittedTime } = ctx.request.body
    const { downloadedTime } = ctx.request.body
    const { convertedTime } = ctx.request.body
    const { totalTime } = ctx.request.body
    const { error } = ctx.request.body
    const { closed } = ctx.request.body

    if (runId && totalTime && error && closed) {
      // 如果必填資料都有，就塞進 articles 裡面。然後依照文件回傳 201
      articles.push({
        id: ++lastId,
        title,
        body,
        author,
        time: new Date()
      })
      ctx.status = 201
      ctx.body = lastId
    } else {
      // 如果有欄位沒有填，就依照文件回傳 400
      ctx.status = 400
    }
  })
  .put('/sampleRun/:id', (ctx) => {
    /* ... */
  })
  .get('/sampleRun/:id', (ctx) => {
    /* ... */
  })
  .delete('/sampleRun/:runId', (ctx) => {
    // 把資料分別存在 id 變數
    const runId = parseInt(ctx.params.runId)

    if (id) {
      // 首先找出文章
      const sampleRun = sampleRuns.find((x) => x.runId === runId)

      if (sampleRun) {
        // 如果有文章的話就刪除文章，然後依照文件回傳 204
        sampleRuns = sampleRuns.filter((x) => x.runId !== runId)
        ctx.status = 204
      } else {
        // 沒有找到的話就依照文件回傳 404
        ctx.status = 404
      }
    } else {
      // 如果沒送 id，文章就不存在，就依照文件回傳 404
      ctx.status = 404
    }
  })

app.use(router.routes())
app.listen(3000)
console.log('App listening on http://localhost:3000')
