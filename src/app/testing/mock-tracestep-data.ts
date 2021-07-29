import { Injectable } from '@angular/core';
import { CommTraceStep } from '@app/models';

@Injectable()
export class MockTraceStepData {
  traceStepdata: CommTraceStep[] = [
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': []
          }
        ]
      },
      'heap': {},
      'lineNumbers': [
        1
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'call',
            'variables': []
          },
          {
            'id': '2081702562288',
            'name': 'Foo',
            'event': 'call',
            'variables': []
          }
        ]
      },
      'heap': {},
      'lineNumbers': [
        1,
        1
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': []
          },
          {
            'id': '2081702562288',
            'name': 'Foo',
            'event': 'line',
            'variables': []
          }
        ]
      },
      'heap': {},
      'lineNumbers': [
        1,
        1
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': []
          },
          {
            'id': '2081702562288',
            'name': 'Foo',
            'event': 'line',
            'variables': []
          }
        ]
      },
      'heap': {},
      'lineNumbers': [
        1,
        2
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': []
          },
          {
            'id': '2081702562288',
            'name': 'Foo',
            'event': 'line',
            'variables': [
              {
                'id': '140703238051776',
                'name': 'a'
              }
            ]
          }
        ]
      },
      'heap': {
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        }
      },
      'lineNumbers': [
        1,
        3
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': []
          },
          {
            'id': '2081702562288',
            'name': 'Foo',
            'event': 'line',
            'variables': [
              {
                'id': '140703238051776',
                'name': 'a'
              },
              {
                'id': '2081702253904',
                'name': '__init__'
              }
            ]
          }
        ]
      },
      'heap': {
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        }
      },
      'lineNumbers': [
        1,
        6
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'return',
            'variables': []
          },
          {
            'id': '2081702562288',
            'name': 'Foo',
            'event': 'return',
            'variables': [
              {
                'id': '140703238051776',
                'name': 'a'
              },
              {
                'id': '2081702253904',
                'name': '__init__'
              },
              {
                'id': '2081702256352',
                'name': 'dostuff'
              }
            ]
          }
        ]
      },
      'heap': {
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        }
      },
      'lineNumbers': [
        1,
        6
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        }
      },
      'lineNumbers': [
        10
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'call',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              }
            ]
          },
          {
            'id': '2081874753952',
            'name': '__init__',
            'event': 'call',
            'variables': [
              {
                'id': '2081874685328',
                'name': 'self'
              },
              {
                'id': '140703238051776',
                'name': 'b'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {}
        }
      },
      'lineNumbers': [
        10,
        3
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              }
            ]
          },
          {
            'id': '2081874753952',
            'name': '__init__',
            'event': 'line',
            'variables': [
              {
                'id': '2081874685328',
                'name': 'self'
              },
              {
                'id': '140703238051776',
                'name': 'b'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {}
        }
      },
      'lineNumbers': [
        10,
        4
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'return',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              }
            ]
          },
          {
            'id': '2081874753952',
            'name': '__init__',
            'event': 'return',
            'variables': [
              {
                'id': '2081874685328',
                'name': 'self'
              },
              {
                'id': '140703238051776',
                'name': 'b'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'b': {
              'id': '140703238051776'
            }
          }
        }
      },
      'lineNumbers': [
        10,
        4
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              },
              {
                'id': '2081874685328',
                'name': 'foo'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'b': {
              'id': '140703238051776'
            }
          }
        }
      },
      'lineNumbers': [
        11
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'call',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              },
              {
                'id': '2081874685328',
                'name': 'foo'
              }
            ]
          },
          {
            'id': '2081674701424',
            'name': 'dostuff',
            'event': 'call',
            'variables': [
              {
                'id': '2081874685328',
                'name': 'self'
              },
              {
                'id': '140703238054656',
                'name': 'x'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'b': {
              'id': '140703238051776'
            }
          }
        },
        '140703238054656': {
          'id': '140703238054656',
          'type': 'int',
          'value': '100',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        }
      },
      'lineNumbers': [
        11,
        6
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              },
              {
                'id': '2081874685328',
                'name': 'foo'
              }
            ]
          },
          {
            'id': '2081674701424',
            'name': 'dostuff',
            'event': 'line',
            'variables': [
              {
                'id': '2081874685328',
                'name': 'self'
              },
              {
                'id': '140703238054656',
                'name': 'x'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'b': {
              'id': '140703238051776'
            }
          }
        },
        '140703238054656': {
          'id': '140703238054656',
          'type': 'int',
          'value': '100',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        }
      },
      'lineNumbers': [
        11,
        7
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              },
              {
                'id': '2081874685328',
                'name': 'foo'
              }
            ]
          },
          {
            'id': '2081674701424',
            'name': 'dostuff',
            'event': 'line',
            'variables': [
              {
                'id': '2081874685328',
                'name': 'self'
              },
              {
                'id': '140703238054656',
                'name': 'x'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'b': {
              'id': '140703238054976'
            }
          }
        },
        '140703238054976': {
          'id': '140703238054976',
          'type': 'int',
          'value': '110',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '140703238054656': {
          'id': '140703238054656',
          'type': 'int',
          'value': '100',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        }
      },
      'lineNumbers': [
        11,
        8
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'return',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              },
              {
                'id': '2081874685328',
                'name': 'foo'
              }
            ]
          },
          {
            'id': '2081674701424',
            'name': 'dostuff',
            'event': 'return',
            'variables': [
              {
                'id': '2081874685328',
                'name': 'self'
              },
              {
                'id': '140703238054656',
                'name': 'x'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'b': {
              'id': '140703238054976'
            }
          }
        },
        '140703238054976': {
          'id': '140703238054976',
          'type': 'int',
          'value': '110',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '140703238054656': {
          'id': '140703238054656',
          'type': 'int',
          'value': '100',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        }
      },
      'lineNumbers': [
        11,
        8
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'line',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              },
              {
                'id': '2081874685328',
                'name': 'foo'
              },
              {
                'id': '140703238054976',
                'name': 'ans'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'b': {
              'id': '140703238054976'
            }
          }
        },
        '140703238054976': {
          'id': '140703238054976',
          'type': 'int',
          'value': '110',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        }
      },
      'lineNumbers': [
        12
      ],
      'stdout': '',
      'stderr': null
    },
    {
      'stack': {
        'frames': [
          {
            'id': '2081891415520',
            'name': 'Global frame',
            'event': 'return',
            'variables': [
              {
                'id': '2081691348928',
                'name': 'Foo'
              },
              {
                'id': '2081874685328',
                'name': 'foo'
              },
              {
                'id': '140703238054976',
                'name': 'ans'
              }
            ]
          }
        ]
      },
      'heap': {
        '2081691348928': {
          'id': '2081691348928',
          'type': '(Foo) class',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'a': {
              'id': '140703238051776'
            },
            '__init__': {
              'id': '2081702253904'
            },
            'dostuff': {
              'id': '2081702256352'
            }
          }
        },
        '140703238051776': {
          'id': '140703238051776',
          'type': 'int',
          'value': '10',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        },
        '2081702253904': {
          'id': '2081702253904',
          'type': 'function',
          'value': '__init__',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081702256352': {
          'id': '2081702256352',
          'type': 'function',
          'value': 'dostuff',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': false,
          'references': null
        },
        '2081874685328': {
          'id': '2081874685328',
          'type': '(Foo) instance',
          'value': 'Foo',
          'renderType': 'kvp',
          'renderOptions': null,
          'immutable': false,
          'references': {
            'b': {
              'id': '140703238054976'
            }
          }
        },
        '140703238054976': {
          'id': '140703238054976',
          'type': 'int',
          'value': '110',
          'renderType': 'basic',
          'renderOptions': null,
          'immutable': true,
          'references': null
        }
      },
      'lineNumbers': [
        12
      ],
      'stdout': '110\n',
      'stderr': null
    }
  ];
}
