import test from 'ava'
import { readFileSync } from 'fs'
import { basename } from 'misc-utils-of-mine-generic'
import { File, magickLoaded } from '../src'
import { main, mainSync } from '../src/main/main'
import { filterResultStdErr } from './testUtil'
import fileType = require('file-type')

test('mainSync', async t => {
  await magickLoaded
  const img = 'test/assets/lenna.jpg'
  const name = `tmp${basename(img)}`
  const f = new File(basename(img), new Uint8ClampedArray(readFileSync(img)))
  const command = `convert ${f.name} -rotate 33 ${name}`
  const result = mainSync({
    command,
    inputFiles: [f],
    debug: true
  })
  t.deepEqual(result.outputFiles.map(f => basename(f.name)), [name])
  t.deepEqual(fileType(result.outputFiles[0].content.buffer), { ext: 'jpg', mime: 'image/jpeg' })
  t.falsy(result.error)
  t.deepEqual(filterResultStdErr(result), [])
})


test('stdout', async t => {
  const result = await main({
    command: ['identify', 'foo.png'],
    inputFiles: [{ name: 'foo.png', content: readFileSync('test/assets/n.png') }]
  })
  t.true(result.stdout.join('').includes('foo.png PNG 109x145 109x145+0+0 8-bit sRGB 39796B'))
  t.deepEqual(filterResultStdErr(result), [])
  t.falsy(result.error)
})

test('output file names', async t => {
  const result = await main({
    debug: true,
    command: 'convert foo.png -scale 50% foo2.png',
    inputFiles: [{ name: 'foo.png', content: readFileSync('test/assets/n.png') }]
  })
  t.deepEqual(result.outputFiles.map(f => basename(f.name)), ['foo2.png'])
  t.deepEqual(fileType(result.outputFiles[0].content.buffer), { ext: 'png', mime: 'image/png' })
  t.falsy(result.error)
  t.deepEqual(filterResultStdErr(result), [])
})

test('accept string input files, or urls', async t => {
  const result = await main({
    command: 'convert n.png -scale 50% foo2.png',
    inputFiles: ['test/assets/n.png']
  })
  t.deepEqual(result.outputFiles.map(f => basename(f.name)), ['foo2.png'])
  t.deepEqual(fileType(result.outputFiles[0].content.buffer), { ext: 'png', mime: 'image/png' })
  t.falsy(result.error)
  t.deepEqual(filterResultStdErr(result), [])
})

test('verbose', async t => {
  const result = await main({
    command: 'convert n.png -rotate 33 foo.png',
    inputFiles: ['test/assets/n.png'],
    verbose: true
  })
  t.falsy(result.error)
  t.deepEqual(result.verbose, [{
    inputFormat: 'png',
    inputSize: { width: 109, height: 145 },
    inputName: 'n.png',
    outputName: 'foo.png',
    outputSize: { width: 173, height: 183 }
  }])
})

test('verbose should set width, height of output files', async t => {
  var result = await main({
    command: 'convert n.png -rotate 33 foo.png',
    inputFiles: ['test/assets/n.png'],
    verbose: true
  })
  t.falsy(result.error)
  t.deepEqual(File.asFile(result.outputFiles[0]).width, 173)
  t.deepEqual(File.asFile(result.outputFiles[0]).height, 183)
  result = await main({
    command: 'convert n.png -rotate 33 foo.png',
    inputFiles: ['test/assets/n.png'],
    verbose: true
  })
  t.falsy(result.error)
  t.deepEqual(File.asFile(result.outputFiles[0]).width, 173)
  t.deepEqual(File.asFile(result.outputFiles[0]).height, 183)
})

test('verbose should set width, height of output files even if not changed', async t => {
  var result = await main({
    command: 'convert n.png foo.png',
    inputFiles: ['test/assets/n.png'],
    verbose: true
  })
  t.falsy(result.error)
  t.deepEqual(File.asFile(result.outputFiles[0]).width, 109)
  t.deepEqual(File.asFile(result.outputFiles[0]).height, 145)
})

test.todo('incorrect IM command')
test.todo('should set options in command')
test.todo('should support input file names with folders: convert input/in/nested/folder/foo.png -scale 100 bar.png')
test.todo('non existing dest folder should be created: convert n.png -scale in/non/existing/folder.gif')
