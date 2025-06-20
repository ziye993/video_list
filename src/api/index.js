const baseapi = '/videolist'

const api = 'http://www.ziye993.cn/' + baseapi;


export function fetchGet(path, data = {}) {
  const url = api + path
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
export const ip = api