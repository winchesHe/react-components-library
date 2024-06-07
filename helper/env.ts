export function isIOS() {
  return /iphone|ipad|itouch/i.test(navigator.userAgent)
}

export function isMacOS() {
  return /Mac/i.test(navigator.userAgent)
}

export function isAppleDevice() {
  return isIOS() || isMacOS()
}

export function isAndroid() {
  return /android/i.test(navigator.userAgent)
}

export function isMobile() {
  return isIOS() || isAndroid()
}
