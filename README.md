# Fast TOML Parser for Node.js

`fast-toml` is the fastest and lightest Javascript parser for TOML files (see [benchmarks](https://www.npmjs.com/package/fast-toml#benchmarks)).

TOML stands for **T**om's **O**bvious and **M**inimal **L**anguage and it is an awesome language for your configuration files, better than JSON and YAML on many aspects. [Learn here](https://github.com/toml-lang/toml) what is TOML and how to use it (it's definitely worth the ten minutes learning).

This part is dedicated to development. See [installation and usage](https://www.npmjs.com/package/fast-toml).


## Development
You need to install globally `rollup` (the bundler) and `rollup-plugin-terser` (the minifier) :

```
npm i -g rollup
npm i -g rollup-plugin-terser
```

Then you need to make sure your global installations are requirable from the rollup.config.js. That means your NODE_PATH environment variable must be set to your global `node_modules` folder.

On my Ubuntu environment it is set to :

```shell
export NODE_PATH=~/.npm-global/lib/node_modules
```

Then run `rollup -c` to compile the bundle.

Or `rollup -c -w` to recompile live on every file change.

## Tests
To run the tests, execute : `node test`.
