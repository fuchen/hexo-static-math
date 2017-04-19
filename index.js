const co = require('co')
const mjAPI = require("mathjax-node")

mjAPI.config({
  MathJax: {
    SVG: {
      scale: 150
    }
  }
})
mjAPI.start()

function renderMathjax(tex, inline) {
  return new Promise((resolve, reject) => {
    mjAPI.typeset({
      math: tex,
      format: inline ? 'inline-TeX' : 'TeX',
      svg: true
    }, function (data) {
      if (!data.errors) {
        if (inline) {
          resolve('<span class="mathjax">' + data.svg.replace(/[\r\n]/g, '') + '</span>')
        } else {
          resolve('<div style="margin: 0.5em 0px; display: block!important; text-align: center">' + data.svg.replace(/[\r\n]/g, '') + '</div>')
        }
      } else {
        reject(data.errors)
      }
    })
  })
}

function replace(data, re, replacer) {
  return co(function *() {
    let parts = {}
    data.replace(re, (match, math, index) => {
      parts[index] = replacer(math)
    })

    parts = yield parts

    return data.replace(re, (match, math, index) => parts[index])
  })
}

function main(hexo) {
  hexo.extend.tag.register(
    'math',
    (args, content) => renderMathjax(content, args[0] === 'inline'),
    { ends: true, async: true }
  )

  const BLOCK_MATH_RENDER_REGEX = /`\$\$(.+?)\$\$`/g
  const INLINE_MATH_RENDER_REGEX = /`\$(.+?)\$`/g

  hexo.extend.filter.register('before_post_render', data => {
    return co(function *() {
      data.content = yield replace(data.content, BLOCK_MATH_RENDER_REGEX, renderMathjax)
      data.content = yield replace(data.content, INLINE_MATH_RENDER_REGEX, math => renderMathjax(math, true))
      return data
    })
  })
}

main(hexo)
