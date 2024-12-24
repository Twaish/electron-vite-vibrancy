const pkg = require('./package.json')

const {
  productName: name,
  build: { appId },
} = pkg

const setupFileName = '${productName}-${platform}-${arch}-${version}-setup.${ext}'

const config = {
  appId: appId,
  productName: name,
  directories: {
    buildResources: 'electron-build',
  },
  files: [
    '!**/.vscode/*',
    '!src/*',
    '!electron.vite.config.{js,ts,mjs,cjs}',
    '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
    '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
    '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}',
  ],
  asarUnpack: ['resources/**'],
  win: {
    executableName: name,
  },
  nsis: {
    artifactName: setupFileName,
    shortcutName: name,
    uninstallDisplayName: name,
    createDesktopShortcut: 'always',
  },
  mac: {
    notarize: false,
    entitlementsInherit: 'electron-build/entitlements.mac.plist',
    extendInfo: {
      NSCameraUsageDescription: "Application requests access to the device's camera.",
      NSMicrophoneUsageDescription: "Application requests access to the device's microphone.",
      NSDocumentsFolderUsageDescription:
        "Application requests access to the user's Documents folder.",
      NSDownloadsFolderUsageDescription:
        "Application requests access to the user's Downloads folder.",
    },
  },
  dmg: {
    artifactName: setupFileName,
  },
  linux: {
    target: ['AppImage', 'snap', 'deb'],
    maintainer: 'electronjs.org',
    category: 'Utility',
  },
  appImage: {
    artifactName: setupFileName,
  },
  npmRebuild: false,
  publish: {
    provider: 'generic',
    url: 'https://example.com/auto-updates',
  },
}
module.exports = config
