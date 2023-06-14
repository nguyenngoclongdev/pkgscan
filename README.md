[![CI](https://github.com/nguyenngoclongdev/pkgscan/actions/workflows/ci.yml/badge.svg)](https://github.com/nguyenngoclongdev/pkgscan/actions/workflows/ci.yml)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/nguyenngoclongdev/pkgscan/)

[![npm version](https://img.shields.io/npm/v/pkgscan.svg?style=flat-square)](https://www.npmjs.org/package/pkgscan)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/nguyenngoclongdev/pkgscan)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=pkgscan&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=pkgscan)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/pkgscan?style=flat-square)](https://bundlephobia.com/package/pkgscan@latest)
[![npm downloads](https://img.shields.io/npm/dt/pkgscan.svg?style=flat-square)](https://npm-stat.com/charts.html?package=pkgscan)
[![Known Vulnerabilities](https://snyk.io/test/npm/pkgscan/badge.svg)](https://snyk.io/test/npm/pkgscan)

# pkgscan

`pkgscan` is a simple and efficient tool to get detailed information about the packages installed in your project. With support from popular package managers such as `npm`, `pnpm`, and `yarn`, you can easily retrieve information about package versions, dependencies, and other relevant information related to installed packages.

If you find this package useful for your projects, please consider supporting me by [Buy Me a Coffee](https://ko-fi.com/D1D2LBPX9). It's a great way to help me maintain and improve this package in the future. Your support is truly appreciated!

<a href='https://ko-fi.com/D1D2LBPX9' target='_blank'>
    <img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee' />
</a>

## Installation

**npm**

```sh
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

# Get details about the installed package with a user-specified package manager.
pkgscan --pkg typescript --cwd ./pnpm-lock.yaml
```

## API

```typescript
import { getInstalledPackageDetails } from 'pkgscan';

// Get details about the installed package with automatic package manager detection.
const installedPackage = await getInstalledPackageDetails('typescript');
console.log(installedPackage);

// Get details about the installed package with a user-specified package manager.
const cwd = __dirname;
const installedPackage = await getInstalledPackageDetails('typescript', cwd);
console.log(installedPackage);
```

## Supported package managers:

- [x] npm (lock file versions 1, 2, 3)
- [x] pnpm (all versions of lock files)
- [x] yarn (all versions of lock files)

## Feedback

If you discover a bug, or have a suggestion for a feature request, please
submit an [issue](https://github.com/nguyenngoclongdev/pkgscan/issues).

## LICENSE

This extension is licensed under the [MIT License](LICENSE)
