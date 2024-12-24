#include <node.h>
#include <windows.h>
#include <dwmapi.h>
#ifndef DWMWA_MICA_EFFECT
#define DWMWA_MICA_EFFECT 1029
#endif
#pragma comment(lib, "dwmapi.lib")

namespace VibrancyEffect {
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Object;
  using v8::Number;
  using v8::Value;

  enum ACCENT_STATE {
    ACCENT_DISABLED = 0,
    ACCENT_ENABLE_GRADIENT = 1,
    ACCENT_ENABLE_TRANSPARENTGRADIENT = 2,
    ACCENT_ENABLE_BLURBEHIND = 3,
    ACCENT_ENABLE_ACRYLICBLURBEHIND = 4,
    ACCENT_INVALID_STATE = 5
  };

  struct ACCENT_POLICY {
    ACCENT_STATE AccentState;
    DWORD AccentFlags;
    DWORD GradientColor;
    DWORD AnimationId;
  };

  struct WINDOWCOMPOSITIONATTRIBDATA {
    DWORD Attrib;
    PVOID pvData;
    SIZE_T cbData;
  };

  typedef BOOL(WINAPI *pSetWindowCompositionAttribute)(HWND, WINDOWCOMPOSITIONATTRIBDATA*);

  HWND GetWindowHandleFromArgs(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
        
    if (args.Length() < 1 || !args[0]->IsNumber()) {
      isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
      return nullptr;
    }

    return (HWND)(LONG_PTR)args[0]->IntegerValue(isolate->GetCurrentContext()).ToChecked();
  }
  HWND GetWindowHandleFromBuffer(v8::Local<v8::Value> value) {
    if (value->IsArrayBufferView()) {
      auto view = value.As<v8::ArrayBufferView>();
      return *static_cast<HWND*>(view->Buffer()->Data());
    }
    return nullptr;
  }

  bool ApplyWindowComposition(HWND hWnd, ACCENT_STATE accentState, DWORD gradientColor = 0) {
    HMODULE hUser = GetModuleHandleA("user32.dll");
    if (!hUser) return false;

    pSetWindowCompositionAttribute SetWindowCompositionAttribute = 
      (pSetWindowCompositionAttribute)GetProcAddress(hUser, "SetWindowCompositionAttribute");
    
    if (!SetWindowCompositionAttribute) return false;

    ACCENT_POLICY accent = { accentState, 0, gradientColor, 0 };
    WINDOWCOMPOSITIONATTRIBDATA data;
    data.Attrib = 19; // WCA_ACCENT_POLICY
    data.pvData = &accent;
    data.cbData = sizeof(accent);
    
    return SetWindowCompositionAttribute(hWnd, &data);
  }

  void SetBlurBehindEffect(const FunctionCallbackInfo<Value>& args) {
    HWND handle = GetWindowHandleFromBuffer(args[0]);
    if (!handle) return;

    bool success = ApplyWindowComposition(handle, ACCENT_ENABLE_BLURBEHIND);
    args.GetReturnValue().Set(v8::Boolean::New(args.GetIsolate(), success));
  }

  void DisableBlurBehindEffect(const FunctionCallbackInfo<Value>& args) {
    HWND handle = GetWindowHandleFromBuffer(args[0]);
    if (!handle) return;

    bool success = ApplyWindowComposition(handle, ACCENT_DISABLED);
    args.GetReturnValue().Set(v8::Boolean::New(args.GetIsolate(), success));
  }

  void SetShadow(const FunctionCallbackInfo<Value>& args) {
    HWND hWnd = GetWindowHandleFromBuffer(args[0]);
    if (!hWnd) return;

    DWORD cornerPreference = DWMWCP_ROUND;
    DwmSetWindowAttribute(hWnd, DWMWA_WINDOW_CORNER_PREFERENCE, &cornerPreference, sizeof(cornerPreference));
  }

  void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "setBlurBehindEffect", SetBlurBehindEffect);
    NODE_SET_METHOD(exports, "disableBlurBehindEffect", DisableBlurBehindEffect);
    NODE_SET_METHOD(exports, "setShadow", SetShadow);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
}