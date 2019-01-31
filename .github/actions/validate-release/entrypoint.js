const semver = require('semver')
const { Toolkit } = require('actions-toolkit')
const tools = new Toolkit()

const pkg = tools.getPackageJSON()
const { release } = tools.context.payload

if (release.draft) {
  console.log('This release is a draft! Aborting.')
  process.exit(0)
}

const tag = semver.valid(release.tag_name)
if (!tag) {
  console.error(`The tag ${release.tag_name} is not a valid tag.`)
  process.exit(1)
}

if (pkg.version !== tag) {
  console.error(`Tag ${tag} and version in the package.json ${pkg.version} are not the same.`)
  process.exit(1)
}

if (release.prerelease && semver.prerelease(release.tag_name) === null) {
  console.error(`The release is a prerelease, but the version tag is not.`)
  process.exit(1)
}

console.log(`Release of version ${tag} is all set!`)