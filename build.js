/* eslint-disable @typescript-eslint/naming-convention */
const { build } = require('esbuild');
const { Generator } = require('npm-dts');
const { dependencies: pkgDependencies, peerDependencies: pkgPeerDependencies } = require('./package.json');

const dependencies = pkgDependencies || {};
const peerDependencies = pkgPeerDependencies || {};

const isDev = process.env.NODE_ENV !== 'production';

const sharedConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: isDev,
    external: Object.keys(dependencies).concat(Object.keys(peerDependencies))
};

build({
    ...sharedConfig,
    platform: 'node', // for CJS
    outfile: 'dist/index.js'
});

build({
    ...sharedConfig,
    outfile: 'dist/index.esm.js',
    platform: 'neutral', // for ESM
    format: 'esm'
});

new Generator({
    entry: 'src/index.ts',
    output: 'dist/index.d.ts',
    force: false,
    tsc: '--emitDeclarationOnly --declaration --outFile dist/index.d.ts --skipLibCheck',
    logLevel: 'debug'
}).generate();
