# Playwright Stealth Plugin

Playwright Plugin for Anti-Bot Stealth.

_Easy to work - No need for extra documentation !_

`Chromium Browser Support - YES`  
`FireFox, Webkit Support- NO`

## `Website Test`

| Website                                                   | Difficulty | RESULT  |
| --------------------------------------------------------- | :--------: | :-----: |
| [SONNY SOFT](https://bot.sannysoft.com/)                  |    EASY    | **YES** |
| [PIXEL SCAN](https://pixelscan.net/bot-check)             |   MEDIUM   | **NO**  |
| [BROWSER SCAN](https://www.browserscan.net/bot-detection) |    HARD    | **YES** |

You can do more test !

## `Library Test`

| Library                                                       | Difficulty | RESULT  |
| ------------------------------------------------------------- | :--------: | :-----: |
| [BotD - FingerprintJS](https://github.com/fingerprintjs/BotD) |    HARD    | **YES** |

Code Snippets : -

```JavaScript
const botdPromise = import('https://openfpcdn.io/botd/v2').then((Botd) => Botd.load())
botdPromise
    .then((botd) => botd.detect())
    .then((result) => console.log(result))
    .catch((error) => console.error(error))
```
