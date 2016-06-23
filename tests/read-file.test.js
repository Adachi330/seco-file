import _aw from 'aw'
import fs from 'fs-extra'
import path from 'path'
import test from 'tape-promise/tape'
import { read as readFile, write as writeFile } from '../src'

const aw = _aw({ injectCallback: false })

test('readFile w/ string passphrase', async (t) => {
  const testDir = path.join('/tmp', 'test', 'seco-file')
  const testFile = path.join(testDir, 'secret.bin')
  fs.emptyDirSync(testDir)

  let secretMessage = Buffer.from('Hello, lets meet at 10 PM to plan our secret mission!', 'utf8')
  const passphrase: string = 'opensesame'

  const [writeFileErr] = await aw(writeFile)(testFile, secretMessage, { passphrase, overwrite: true })
  t.ifError(writeFileErr, 'no error')

  const [readFileErr, readFileRes] = await aw(readFile)(testFile, passphrase)
  t.ifError(readFileErr, 'no error on read')

  t.is(readFileRes.toString('utf8'), secretMessage.toString('utf8'), 'verify content is the same')
  t.true(readFileRes.toString('utf8').indexOf('11 PM'), 'has new content')

  t.end()
})
