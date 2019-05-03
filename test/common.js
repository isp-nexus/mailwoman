const Tokenizer = require('../tokenization/Tokenizer')

const extract = (tokenizer) => {
  return tokenizer.solution.map(s => s.pair.map(c => {
    return {
      [c.classification.label]: c.span.body
      // offset: c.span.start
    }
  }))
}

const assert = (test, parser, input, expected, firstOnly) => {
  let tokenizer = new Tokenizer(input)
  parser.classify(tokenizer)
  parser.solve(tokenizer)
  test(input, (t) => {
    let ext = extract(tokenizer)
    t.deepEquals(firstOnly ? ext[0] : ext, expected)
    t.end()
  })
}

module.exports.assert = assert
module.exports.extract = extract
