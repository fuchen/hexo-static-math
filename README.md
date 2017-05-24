# hexo-static-math
A hexo plugin which renders math expressions into the generated html files.

# Why use this
Math expressions are statically rendered into html files offline, so it's no need to load mathjax script from CDN when openning the page.

## How to install

`npm install hexo-static-math --save`

## Usage

* Display as block: `{% math %} h_\theta(x) = \theta^Tx {% endmath %}`
* Display inline: `{% math inline %} blabla.. {% endmath %}`

For single line expressions, you can also use `` `$$... $$` `` for block level expressions, or `` `$... $` `` for inline expressions.
