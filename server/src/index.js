import '@babel/polyfill'
import bodyParser from 'body-parser'
import debug from 'debug'
import express, { Router } from 'express'
import fs from 'fs-extra'
import got from 'got'
import helmet from 'helmet'
import _ from 'lodash'
import path from 'path'
import uuid from 'uuid'

const log = debug('app:server')
const PORT = process.env.PORT || 8080

const app = express()

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let lottery = {
  history: [],
  current: {
    id: uuid(),
    prize: 1000000,
    ticket: [],
    result: []
  }
}

let drawling = false

const router = new Router()

router.use('/buy', async (req, res, next) => {
  try {
    if (drawling) {
      res.status(200).json({
        code: 0,
        message: `Drawling! Try again later`
      })
      return
    }

    const { number } = req.body

    log('number:', number)

    lottery.current.ticket.push(number)

    res.status(200).json({
      code: 0,
      message: `OK`
    })
  } catch (ex) {
    next(ex)
  }
})

router.use('/lottery', async (req, res, next) => {
  try {
    res.status(200).json({
      code: 0,
      message: `OK`,
      payload: {
        lottery: lottery
      }
    })
  } catch (ex) {
    next(ex)
  }
})

router.use('/random', async (req, res, next) => {
  try {
    drawling = true

    let token = (await got.get(
      `https://test.ginar.io/rng/initialize/${new Date().getTime().toString()}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            'pk_3051545020979047:sk_3051545020979048'
          ).toString('base64')}`
        }
      }
    )).body

    log(`token:`, token)

    let t1 = (await got.get(
      `https://test.ginar.io/rng/generate/${token.toString()}/1/69`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            'pk_3051545020979047:sk_3051545020979048'
          ).toString('base64')}`
        },
        json: true
      }
    )).body

    log(`t1:`, t1)

    if (t1 === 'invalid request') {
      throw new Error('Can not get random from server')
    }

    while (!t1['beacon']) {
      t1 = (await got.get(
        `https://test.ginar.io/rng/generate/${t1[
          'sessionKey'
        ].toString()}/1/69`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              'pk_3051545020979047:sk_3051545020979048'
            ).toString('base64')}`
          },
          json: true
        }
      )).body
      log(`t1:`, t1)

      if (t1 === 'invalid request') {
        throw new Error('Can not get random from server')
      }
    }

    let t2 = (await got.get(
      `https://test.ginar.io/rng/generate/${t1['sessionKey'].toString()}/1/26`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            'pk_3051545020979047:sk_3051545020979048'
          ).toString('base64')}`
        },
        json: true
      }
    )).body

    log(`t2:`, t2)

    if (t2 === 'invalid request') {
      throw new Error('Can not get random from server')
    }

    while (!t2['beacon']) {
      t2 = (await got.get(
        `https://test.ginar.io/rng/generate/${t2[
          'sessionKey'
        ].toString()}/1/26`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              'pk_3051545020979047:sk_3051545020979048'
            ).toString('base64')}`
          },
          json: true
        }
      )).body

      log(`t2:`, t2)

      if (t2 === 'invalid request') {
        throw new Error('Can not get random from server')
      }
    }

    const random = [
      {
        hash: t1['sessionKey'].toString(),
        number: _.take(_.uniq(t1.nums), 5)
      },
      {
        hash: t2['sessionKey'].toString(),
        number: _.take(_.uniq(t2.nums), 1)
      }
    ]

    if (!random[0] || !random[1] || !random[0].number || !random[1].number) {
      throw new Error('Can not get random from server')
    }

    lottery.current.result = random
    lottery.history = [lottery.current, ...lottery.history]
    lottery.current = {
      id: uuid(),
      prize: 1000000,
      ticket: [],
      result: []
    }

    drawling = false

    res.status(200).json({
      code: 0,
      message: `OK`,
      payload: {
        random: random
      }
    })
  } catch (ex) {
    drawling = false
    res.status(200).json({
      code: 1,
      message: ex.message,
      payload: {
        random: [
          {
            hash: '0',
            number: [0, 0, 0, 0, 0]
          },
          {
            hash: '0',
            number: [0]
          }
        ],
        message: ex.body
          ? JSON.parse(ex.body)['message'] || ex.message
          : ex.message
      }
    })
  }
})

app.use('/api', router)

app.use(express.static(path.resolve('./../client/build')))

app.use('*', function(req, res) {
  res.sendFile(path.resolve('./../client/build/index.html'))
})

app.use(async (err, req, res, next) => {
  log(`error: ${err}`)
  res.status(200).json({
    code: 1,
    message: err.message || 'INTERNAL_SERVER_ERROR'
  })
})

app.listen(PORT, () => {
  log(`Application started on port: ${PORT}`)
})
