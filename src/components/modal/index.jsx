import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'
import './index.css';

// 创建通知容器
let toastRoot = null;
if (typeof document !== 'undefined') {
  const rootElement = document.createElement('div');
  rootElement.id = 'toast-root';
  document.body.appendChild(rootElement);
  toastRoot = createRoot(rootElement);
}

let toastList = [];

// Toast 组件
const Toast = ({ content, type = 'default', duration = 30000, id }) => {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef(null);
  const [end, setEnd] = useState(false);
  // 自动隐藏
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, duration + 300);
    const id = setTimeout(() => {
      setEnd(true)
    }, duration);

    return () => {
      // 清理定时器防止内存泄漏
      clearTimeout(timeoutRef.current);
      clearTimeout(id)
    };
  }, [duration]);

  // 隐藏后卸载组件
  useEffect(() => {
    if (!isVisible && toastRoot) {
      // 使用 null 卸载所有内容
      clearRender(id);
    }
  }, [isVisible]);

  // 样式类可根据 type 自定义
  const toastClass = `toast toast-${type} toast${isVisible ? 'show' : 'hide'}`;

  return (
    <div className={toastClass} role="alert" style={{ transform: `translateX(${end ? '300px' : '0px'})`, opacity: `${end ? '0' : '1'}` }}>
      {content}
    </div>
  );
};

const clearRender = (id) => {
  toastList = toastList.filter(_ => _.id !== id);
  if (!toastList.length) {
    toastRoot.render(null);
    return
  }

  toastRoot.render(<>{
    toastList.map(_ => {
      const duration = _.endTime - Date.now();
      console.log(duration)
      if (duration < 0) {
        return <></>
      }
      return <Toast
        key={`toast_${_.id}`}
        id={_.id}
        content={_.content}
        type={_.options.type || 'default'}
        duration={duration}
      />
    })
  }
  </>
  );
}


export const showToast = (content, options = {}) => {
  const randomId = Math.random();
  toastList.push({ content, options, id: randomId, endTime: Date.now() + (options.duration || 3000) })
  if (!toastRoot) return;
  clearRender()
};
export default showToast;  