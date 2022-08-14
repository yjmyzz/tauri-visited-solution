import React, { useEffect } from 'react';
import './App.css';

function setVisited() {
  let localstorageSimuHistory = localStorage.getItem('simuHistory');
  let simuHistory = localstorageSimuHistory ? JSON.parse(localstorageSimuHistory) : [];

  //过期访问记录清理
  const now = new Date();
  let hasExpired = false;
  for (let i = simuHistory.length - 1; i >= 0; i--) {
    let item = simuHistory[i];
    //过期的访问记录删除
    if (now.getTime() > item.expire) {
      simuHistory.splice(i, 1)
      hasExpired = true
    }
  }
  if (hasExpired) {
    if (simuHistory.length <= 0) {
      localStorage.removeItem('simuHistory');
    }
    else {
      localStorage.setItem('simuHistory', JSON.stringify(simuHistory));
    }
  }

  //遍历所有a，访问过的，则强制附加visited样式
  let elements = document.getElementsByTagName('a');
  for (let i = 0; i < elements.length; i++) {
    for (let h = 0; h < simuHistory.length; h++) {
      if (elements[i].href === simuHistory[h].url) {
        elements[i].className += ' visited';
      }
    }
  }
}

function bindAddHref() {
  let elements = document.getElementsByTagName('a');
  for (let i = 0; i < elements.length; i++) {
    elements[i].onclick = (obj) => {
      addHref(elements[i].href);
    }
  }
  setVisited();
}

function addHref(url: String) {
  let localstorageSimuHistory = localStorage.getItem('simuHistory');
  let simuHistory = localstorageSimuHistory ? JSON.parse(localstorageSimuHistory) : [];
  let found = false;
  const now = new Date();
  //访问记录过期时间设置（此处仅为示例：30秒）
  const ttl: number = 1000 * 30;

  for (let i = simuHistory.length - 1; i >= 0; i--) {
    let item = simuHistory[i];
    if (item.url === url) {
      found = true;
      //过期时间续租
      simuHistory[i] = { "url": url, "expire": new Date().getTime() + ttl };
      break;
    }
  }
  //如果本链接不在访问列表里，则添加
  if (found === false) {
    //过期时间(示例30秒)
    simuHistory[simuHistory.length] = { "url": url, "expire": new Date().getTime() + ttl };
    localStorage.setItem('simuHistory', JSON.stringify(simuHistory));
  }

  setVisited();
}


function App() {
  //在组件加载阶段，触发simuHistory
  useEffect(() => {
    return () => {
      console.log("DidMount");
      bindAddHref();
    }
  }, []);
  return (
    <div className="App">
      <p>
        <a className='test' href="#1" target='_blank'>#1</a>
        <a className='test' href="#2" target='_blank'>#2</a>
        <a className='test' href="#3" target='_blank'>#3</a>
      </p>
    </div>
  );
}

export default App;
