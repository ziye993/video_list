let defaultUrl;
let ip
export const updateIp = async () => {
  if (ip || defaultUrl) {
    console.log('ip', ip, " ", defaultUrl)
    return ip
  }
  return await fetch('./ip.json') // 对应public/data.json
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(jsonData => {
      ip = jsonData.ip;
      defaultUrl = "http://" + ip
      return jsonData;
    })
    .catch(error => {
      throw Error("未找到ip")
    });
}

export function fetchGet(path, data = {}) {
  const url = defaultUrl + path
  // 处理请求参数
  const queryString = Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');

  // 构建完整URL
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  // 发起fetch请求
  return fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
}