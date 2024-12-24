{
  "targets": [
    {
      "target_name": "vibrancy",
      "sources": [ "src/vibrancy.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "conditions": [
        ['OS=="win"', {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "AdditionalOptions": [ "/EHsc" ]
            }
          }
        }]
      ],
      "variables": {
        "node_version": "<!(node -v | sed 's/v//')"
      },
      "target_conditions": [
        ['node_version >= "16.0.0"', {
          "defines": [ "NODE_GYP_V8_MAJOR_VERSION=9" ]
        }]
      ]
    }
  ]
}