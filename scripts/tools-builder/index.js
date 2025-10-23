import JSDocCollector from './jsdoc-collector.js'

const collector = new JSDocCollector({
  sourcePaths: [
    './src',
  ],
  outputPath: './definitions.json'
})

try {
  console.log('🔍 Collecting JSDoc definitions...')
  await collector.collect()
  console.log('\n✅ Done!')
} catch (err) {
  console.error('❌ Error:', err.message)
  process.exit(1)
}
