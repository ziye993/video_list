export function isPC() {
  const userAgentInfo = navigator.userAgent;
  const Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"
  ];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

export function setItem(key, value) {
  try {
    // 将数据转换为 JSON 字符串
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error setting localStorage:', error);
    return false;
  }
}
export function getItem(key, defaultValue = null) {
  try {
    const jsonValue = localStorage.getItem(key);
    // 如果值不存在，返回默认值
    if (jsonValue === null) {
      return defaultValue;
    }
    // 解析 JSON 字符串
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue;
  }
}
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing localStorage:', error);
    return false;
  }
}
export function clear() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}


export function refreshThumbnails() {
  fetch("/refresh")
    .then((response) => response.text())
    .then((data) => {
      alert(data);
      location.reload();
    })
    .catch((error) => {
      alert("Error refreshing thumbnails: " + error);
    });
}

export function isUploadTimeOverTenMinutes() {
  const uploadTime = localStorage.getItem("uploadTime");
  if (uploadTime) {
    const currentTime = Date.now();
    const tenMinutesInMilliseconds = 10 * 60 * 1000;
    return (currentTime - parseInt(uploadTime)) > tenMinutesInMilliseconds;
  }
  return true;
}

let scriptIsMomery = false;
export function memoryScrip(checked) {
  if (checked) {
    scriptIsMomery = true;
  }
}

export function sortByTime(arr, type) {
  return arr.sort((a, b) => {
    // 将 time 转换为 Date 对象进行比较
    const timeA = new Date(a.time);
    const timeB = new Date(b.time);
    if (type === 0) {
      return timeA - timeB;
    } else {
      return timeB - timeA
    }

  });
}

export function sortByName(arr, type) {
  return arr.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // 忽略大小写
    const nameB = b.name.toUpperCase(); // 忽略大小写
    if (nameA < nameB) {
      return type === 0 ? -1 : 1;
    }
    if (nameA > nameB) {
      return type === 0 ? 1 : -1;
    }
    // 如果名称相同，则保持原顺序
    return 0;
  });
}

export function inputPws() {
  var pws = prompt("请输入密码");
  if (pws == "9") {
    var pwst = prompt("错误，请重新输入");
    if (pwst == "6") {
      localStorage.setItem("uploadTime", Date.now());
    } else {
      window.close();
    }
  } else {
    window.close();
  }
}