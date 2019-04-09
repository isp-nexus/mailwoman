const StreetClassification = require('../../classification/StreetClassification')

module.exports = [
  {
    // West Main Street
    confidence: 1.0,
    Class: StreetClassification,
    scheme: [
      {
        is: ['DirectionalClassification'],
        not: ['StreetClassification']
      },
      {
        is: ['AlphaClassification'],
        not: ['StreetClassification']
      },
      {
        is: ['StreetSuffixClassification'],
        not: ['StreetClassification']
      }
    ]
  },
  {
    // Main Street
    confidence: 1.0,
    Class: StreetClassification,
    scheme: [
      {
        is: ['AlphaClassification'],
        not: ['StreetClassification', 'IntersectionClassification']
      },
      {
        is: ['StreetSuffixClassification'],
        not: ['StreetClassification']
      }
    ]
  },
  {
    // West 26th Street
    confidence: 1.0,
    Class: StreetClassification,
    scheme: [
      {
        is: ['DirectionalClassification'],
        not: ['StreetClassification']
      },
      {
        is: ['OrdinalClassification'],
        not: ['StreetClassification']
      },
      {
        is: ['StreetSuffixClassification'],
        not: ['StreetClassification']
      }
    ]
  },
  {
    // 26th Street
    confidence: 1.0,
    Class: StreetClassification,
    scheme: [
      {
        is: ['OrdinalClassification'],
        not: ['StreetClassification']
      },
      {
        is: ['StreetSuffixClassification'],
        not: ['StreetClassification']
      }
    ]
  },
  {
    // West 26 Street
    confidence: 0.2,
    Class: StreetClassification,
    scheme: [
      {
        is: ['DirectionalClassification'],
        not: ['StreetClassification']
      },
      {
        is: ['NumericClassification'],
        not: ['StreetClassification']
      },
      {
        is: ['StreetSuffixClassification'],
        not: ['StreetClassification']
      }
    ]
  },
  {
    // 26 Street
    confidence: 0.1,
    Class: StreetClassification,
    scheme: [
      {
        is: ['NumericClassification'],
        not: ['StreetClassification']
      },
      {
        is: ['StreetSuffixClassification'],
        not: ['StreetClassification']
      }
    ]
  }
]