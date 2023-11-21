export default function getOS() {
    let userAgent = window?.navigator.userAgent.toLowerCase(),
      macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
      windowsPlatforms = /(win32|win64|windows|wince)/i,
      os = null;
  
    if (macosPlatforms.test(userAgent)) {
      os = "macos";
    } else if (windowsPlatforms.test(userAgent)) {
      os = "windows";
    }else{
        os = "other"
    }
  
    return os;
  }