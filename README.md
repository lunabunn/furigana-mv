# furigana-mv

RPG Maker MV plugin to automatically display furigana for in-game dialogue.

![Demo Image](demo.png)

## How to use

Place `Furigana.js` in your `./js/plugins` directory. Then, download all the `*.dat.gz` files [here](https://github.com/takuyaa/kuromoji.js/tree/master/dict) and copy them over to `./data/dict` (you can change this directory from the RPG MV Plugin Manager).

## How to build

`Furigana.js` is just a concatenation of `./src/index.js`, `./src/kuroshiro.js`, and `./src/kuroshiro-analyzer-kuromoji.js` (in that order). There's a BAT script, `./src/bundle.bat`, that you can run to automatically generate `./Furigana.js`. If you want to contribute, you should make your changes in the actual script files, run `bundle.bat`, then test using `Furigana.js`.

## Technologies used

furigana-mv is powered by (slightly modified versions of) [hexenq/kuroshiro](https://github.com/hexenq/kuroshiro) and [hexenq/kuroshiro-analyzer-kuromoji](hexenq/kuroshiro-analyzer-kuromoji). Those two projects are licensed under the MIT license, as is this project. The license for this project can be found in the root directory. The licenes for kuroshiro and kuroshiro-analyzer-kuromoji can be found in their respective source files.