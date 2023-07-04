[![CI](https://github.com/nguyenngoclongdev/pkgscan/actions/workflows/ci.yml/badge.svg)](https://github.com/nguyenngoclongdev/pkgscan/actions/workflows/ci.yml)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/nguyenngoclongdev/pkgscan/)

[![npm version](https://img.shields.io/npm/v/pkgscan.svg?style=flat-square)](https://www.npmjs.org/package/pkgscan)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/nguyenngoclongdev/pkgscan)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=pkgscan&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=pkgscan)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/pkgscan?style=flat-square)](https://bundlephobia.com/package/pkgscan@latest)
[![npm downloads](https://img.shields.io/npm/dt/pkgscan.svg?style=flat-square)](https://npm-stat.com/charts.html?package=pkgscan)

# pkgscan

<p align="center">
  <!-- npm -->
  <a href="https://www.npmjs.com" target="_blank">
      <img src="https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff&style=for-the-badge" alt="npm">
  </a>
  <!-- yarn -->
  <a href="https://yarnpkg.com" target="_blank">
     <img src="https://img.shields.io/badge/Yarn-2C8EBB?logo=yarn&logoColor=fff&style=for-the-badge" alt="yarn">
  </a>
    <!-- pnpm -->
  <a href="https://pnpm.io" target="_blank">
     <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff&style=for-the-badge" alt="pnpm">
  </a>
</p>

`pkgscan` is a useful tool to inspect installed packages in your project. It provides detailed information about installed packages managed by popular package managers like `npm`, `pnpm` and `yarn`.

![pkgscan](https://github.com/nguyenngoclongdev/pkgscan/raw/HEAD/images/demo.gif)

If you find this package useful for your projects, please consider supporting me by [Buy Me a Coffee](https://ko-fi.com/D1D2LBPX9). It's a great way to help me maintain and improve this package in the future. Your support is truly appreciated!

<a href='https://ko-fi.com/D1D2LBPX9' target='_blank'>
    <img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee' />
</a>

## Installation

**npm**

```sh
# Try with npx
npx pkgscan [options]

# Locally in your project.
npm install pkgscan

# Or globally (use as cli)
npm install -g pkgscan
```

## CLI

### Usage

```
pkgscan [options]

Options:
  -p, --pkg    The name of the package to retrieve information for.
  -c, --cwd    The current working directory of the project.
  -h, --help   Show help
```

### Examples

```sh
# Get details about the installed package with automatic package manager detection.
pkgscan --pkg typescript

# Get details about the installed package with glob pattern.
pkgscan --pkg '@types/*'

# To scan all installed packages
pkgscan --pkg '*'

# Get details about the installed package with a user-specified package manager.
pkgscan --pkg typescript --cwd ./project-directory-path
```

## API

```typescript
import { getInstalledPackage } from 'pkgscan';

// Get details about the installed package with automatic package manager detection.
const installedPackage = getInstalledPackage('typescript');
console.log(installedPackage);
/*
[
  {
    name: 'typescript',
    version: '5.1.3',
    isDirectProjectDependency: true,
    dev: true,
    license: 'Apache-2.0',
    engines: { node: '>=14.17' }
  }
]
*/

// Get details about the installed package with a user-specified package manager.
const cwd = __dirname;
const installedPackage = getInstalledPackage('typescript', cwd);
console.log(installedPackage);
/*
[
  {
    name: 'typescript',
    version: '5.1.3',
    isDirectProjectDependency: true,
    dev: true,
    license: 'Apache-2.0',
    engines: { node: '>=14.17' }
  }
]
*/
```

> `isDirectProjectDependency` used to determine whether a package is a direct dependency of a project or not. By using this variable, you can check whether a package is directly listed in the dependencies section of the project's package.json file or not.

## Feedback

If you discover a bug, or have a suggestion for a feature request, please
submit an [issue](https://github.com/nguyenngoclongdev/pkgscan/issues).

## LICENSE

This extension is licensed under the [MIT License](LICENSE)
