Dump an object with pretty colors for instant visual greping. Works on *terminal console* and *browser*.

## Node API

Here is how to log
```js
import cute from 'cute-dump'

myObject = {
   foo: 9,
   bar: 12,
   now: "2019-11-29T15:05:13.871Z",
   reservedWord: true,
   myObject: {
      x: [
         5,
         {
            z: 5312,
            theta: 321
         },
         {
            z: 45,
            theta: 868
         },
         "Yo"
      ],
      hi: "Hi Foo"
   }
}

cute.dump(myObject)
// `dump` is an alias of `log` so you can also do :
cute.log(myObject)
```

### Warn & error

You can also use `cute.warn` and `cute.error` along with `cute.log`.

### Cute HTML

You can transform an object into html to display in in a web page :

```js
let html = cute.html(myObject)
```

The styling is not done by default, you have add to specify your own style through CSS.

Since `cute-dump` assign classes to the elements so you just have to add a bit of CSS.

Here is a simple example of CSS that works well with a white background :

```css
.cute-dump-property {
   color: #777;
   font-weight: bold;
}

.cute-dump-number {
   font-weight: bold;
   color: #8a2b8a;
}

.cute-dump-keyword {
   font-weight: bold;
   font-style: italic;
   color: #4fa2d6;
}

.cute-dump-string {
   font-weight: bold;
   color: #21a033;
}
```


## Usage in browser

If you want to use `cute-dump` in a browser, include the [browser version](https://github.com/Lepzulnag/cute-dump/blob/master/browser/cute-dump.js) in a script tag.

You can then use the global object `cute` in the same way as in the Node API, with the only difference that printing in console won't be colored.
