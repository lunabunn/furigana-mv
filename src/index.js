//=============================================================================
// Furigana.js
//=============================================================================

/*:
 * @plugindesc Furigana for in-game dialogue.
 * @author lunabunn
 * 
 * @param dictDir
 * @text Kuromoji Dictionaries
 * @default data/dict
 * 
 * @param to
 * @text Convert To
 * @type select
 * @option hiragana
 * @option katakana
 * @option romaji
 * @default hiragana
 * 
 * @param mode
 * @text Mode
 * @type select
 * @option normal
 * @option spaced
 * @option okurigana
 * @option furigana
 * @default furigana
 * 
 * @help This plugin implements the \ruby[text,ruby] escape code for internal use. Implementation details may change anytime, so use at your own discretion.
 */

window.FURIGANA = {};

let _initialize = Scene_Boot.prototype.initialize;
Scene_Boot.prototype.initialize = function () {
    _initialize.call(this);
    this._kuroshiroInit = false;
};

let _isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function () {
    if (this._kuroshiroInit) {
        return _isReady.call(this);
    } else {
        return false;
    }
};

let _create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function () {
    _create.call(this);
    FURIGANA.kuroshiro = new Kuroshiro();
    FURIGANA.analyzer = new KuromojiAnalyzer({
        dictPath: PluginManager.parameters("Furigana")["dictDir"],
    });
    FURIGANA.kuroshiro.init(FURIGANA.analyzer).then(() => {
        this._kuroshiroInit = true;
        console.log("Kuroshiro loaded successfully!");
    });
};

let _processNewLine = Window_Base.prototype.processNewLine;
Window_Base.prototype.processNewLine = function (textState) {
    if (/^.*\x1bruby/.test(textState.text.slice(textState.index).trimLeft())) {
        textState.y += textState.height * 0.3;
    }
    _processNewLine.call(this, textState);
};

let _processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
Window_Base.prototype.processEscapeCharacter = function (code, textState) {
    _processEscapeCharacter.call(this, code, textState);
    if (code == "RUBY") {
        let match = /^\[(.+?), *(.+?)\]/.exec(textState.text.slice(textState.index));
        if (match) {
            textState.index += match[0].length;
            let text = match[1];
            let ruby = match[2];

            let width = this.textWidth(text);

            this.makeFontSmaller();

            let rubyWidth = this.textWidth(ruby);
            let space = (width - rubyWidth) / (ruby.length + 1);

            let rubyX = textState.x + space;
            let rubyY = textState.y - textState.height / 1.5;
            for (let c of ruby) {
                this.drawText(c, rubyX, rubyY);
                rubyX += rubyWidth / ruby.length + space;
            }

            this.makeFontBigger();

            this.drawText(text, textState.x, textState.y, width * 2);
            textState.x += width;
        }
    }
};

let _newPage = Window_Message.prototype.newPage;
Window_Message.prototype.newPage = function (textState) {
    _newPage.call(this, textState);
    if (/^.*\x1bruby/.test(textState.text.slice(textState.index).trimLeft())) {
        textState.y = textState.height * 0.3;
    } else {
        textState.y = 0;
    }
};

let _add = Game_Message.prototype.add;
Game_Message.prototype.add = function (text) {
    _add.call(this, FURIGANA.kuroshiro.convert(text, { to: PluginManager.parameters("Furigana")["to"], mode: PluginManager.parameters("Furigana")["mode"] }).replace(/<ruby>(.*?)<rp>\(<\/rp><rt>(.*?)<\/rt><rp>\)<\/rp><\/ruby>/g, "\\ruby[$1,$2]"));
};