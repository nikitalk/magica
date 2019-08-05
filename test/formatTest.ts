import test from 'ava'
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { array } from 'misc-utils-of-mine-generic'
import { File, imageCompare, main, run } from '../src'
import fileType = require('file-type')

test.serial('identify', async t => {
  let r = execSync('npx ts-node -T test/assets/formatConvertIdentifyScript.ts')
  t.true(r.toString().includes('total time:'))
})

test('webp read', async t => {
  const result = await run({
    script: `convert ear.webp -scale 200% ear.gif`,
    inputFiles: ['test/assets/ear.webp']
  })
  t.deepEqual(result.stderr.filter(s => !s.includes('UnableToOpenConfigureFile') && !s.includes('Calling stub instead of')), [])
  t.falsy(result.error)
  t.deepEqual(fileType(result.outputFiles[0].content.buffer), { ext: 'gif', mime: 'image/gif' })
  t.true(await imageCompare(await File.fromFile('test/assets/ear.webp'), result.outputFiles[0]))
})

test('webp read main', async t => {
  const result = await main({
    command: `convert ear.webp -scale 200% ear.png`.trim().split(' '),
    inputFiles: ['test/assets/ear.webp']
  })
  t.falsy(result.error)
  writeFileSync('tmp.png', result.outputFiles[0].content)
  t.deepEqual(fileType(result.outputFiles[0].content.buffer), { ext: 'png', mime: 'image/png' })
  t.true(await imageCompare(await File.fromFile('test/assets/ear.webp'), result.outputFiles[0]))
  t.false(await imageCompare(await File.fromFile('test/assets/n.png'), result.outputFiles[0]))
})

test('webp write', async t => {
  const result = await run({
    script: `convert n.png -scale 50% -rotate 133 n2.webp`,
    inputFiles: ['test/assets/n.png']
  })
  t.deepEqual(result.stderr.filter(s => !s.includes('UnableToOpenConfigureFile') && !s.includes('Calling stub instead of')), [])
  t.falsy(result.error)
  t.deepEqual(fileType(result.outputFiles[0].content.buffer), { ext: 'webp', mime: 'image/webp' })
  t.true(await imageCompare(await File.fromFile('test/assets/run_2.gif'), result.outputFiles[0]))
})

test('mng read', async t => {
  let result = await run({
    script: `convert input.mng -scale 50% input.gif`,
    inputFiles: ['test/assets/input.mng']
  })
  t.falsy(result.error)
  t.deepEqual(fileType(result.outputFiles[0].content.buffer), { ext: 'gif', mime: 'image/gif' })
  const info = await File.asFile(result.outputFiles[0]).info()
  t.deepEqual(
    info.map(i => ({ mimeType: i.mimeType, numberPixels: i.numberPixels, type: i.type })),
    array(6).map(i => ({ mimeType: 'image/gif', numberPixels: '576', type: 'Palette' }))
  )
})

test('mng write', async t => {
  let result = await run({
    script: `convert input.gif -scale 50% input.mng`,
    inputFiles: ['test/assets/input.gif']
  })
  t.falsy(result.error)
  const info = await File.asFile(result.outputFiles[0]).info()
  t.deepEqual(
    info.map(i => ({ mimeType: i.mimeType, numberPixels: i.numberPixels, type: i.type })),
    array(6).map(i => ({ mimeType: 'video/x-mng', numberPixels: '576', type: 'Palette' }))
  )
})

  ;
['jp2', 'j2k', 'jpc'].forEach(async ext => {
  test(`${ext} read`, async t => {
    let result = await run<File>({
      script: `convert input2.${ext} -rotate 32 -scale 88% input2.png`,
      inputFiles: [`test/assets/input2.${ext}`]
    })
    t.deepEqual(fileType(result.outputFiles[0].content.buffer), { ext: 'png', mime: 'image/png' })
    t.falsy(result.error)
    t.true(await result.outputFiles[0].equals(await File.fromFile(`test/assets/input2.png`)))
  })
})
