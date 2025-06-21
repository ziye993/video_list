import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { inputPws, isPC, isUploadTimeOverTenMinutes, sortByName, sortByTime } from "./utils";
import { fetchGet, fileip ,ip} from "./api";
import VideoController from "./video";
import showToast from "./components/modal";

const options = [
  { value: 'ctime_max', label: 'ctime_近在前' },
  { value: 'ctime_min', label: 'ctime_远在前' },

  { value: 'atime_max', label: 'atime_近在前' },
  { value: 'atime_min', label: 'atime_远在前' },

  { value: 'birthtime_max', label: 'birthtime_近在前' },
  { value: 'birthtime_min', label: 'birthtime_远在前' },

  { value: 'mtime_max', label: 'mtime_近在前' },
  { value: 'mtime_min', label: 'mtime_远在前' },

  { value: 'size_max', label: '文件大__小' },
  { value: 'size_min', label: '文件小__大' },

  { value: 'name_max', label: '名称 a_z' },
  { value: 'name_min', label: '名称 z_a' },
];

function App() {
  const [data, setData] = useState([]);
  const formRef = useRef(null);
  const sourceData = useRef([]);
  const [inputData, setInputData] = useState();
  const [show, setShow] = useState(false);
  const [uploadblockShow, SU] = useState(false);
  const [fileInfoBlockShow, SB] = useState(false);
  const [currentFile, SCF] = useState();
  const listRef = useRef(null)

  function formatList(list) {
    return (list || []).map(_ => ({
      ..._,
      sourceSrc:`${fileip}/${_.fileName}.${_.ext}`,
      converSrc: `${fileip}/${_.fileName}.png`,
      atime: _.atime.timestamp,
      atime_f: _.atime.formatted,

      birthtime: _.birthtime.timestamp,
      birthtime_f: _.birthtime.formatted,

      ctime: _.ctime.timestamp,
      ctime_f: _.ctime.formatted,

      mtime: _.mtime.timestamp,
      mtime_f: _.mtime.formatted,
    }))
  }


  function undataTime() {
    localStorage.setItem("uploadTime", Date.now());
  }
  async function updataList() {
    setData(() => ([]));
    const data = await fetchGet('/refList');
    if (data.data) {
      setData(formatList(data.data));
    }
    showToast(`刷新完成，共找到${data.data.length}条数据`)
  }

  async function undataFile() {
    setData(() => ([]));
    const { data } = await fetchGet('/refreshBlock');
    showToast(`刷新文件成功! [数量:${data.reNumber}]::[成功：${data.suNumber}]`)
    await getList()
    console.log(data)
  }

  async function getList(params) {
    const fetchdata = await fetchGet('/getFileList');
    const statusData = formatList(fetchdata?.data)
    setData(statusData);
    sourceData.current = statusData;
    showToast(`加载完成，共找到${statusData.length}条数据`)
    console.log(statusData)
  }

  function seach(str) {
    const tmpList = [];
    sourceData.current.forEach(_ => {
      if (_.fileName.toUpperCase().includes(str.toUpperCase()) || !str) {
        tmpList.push(_)
      }
    });
    setData(tmpList);
    showToast(`刷新完成，共找到${tmpList.length}条数据`)
  };

  async function uploadFile(e) {
    // const form = document.getElementById('uploadForm');
    // form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    try {
      const response = await fetch(`${ip}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.text();
        console.log('Upload success:', data);
        SU(false);
        showToast('上传成功!')
      } else {
        showToast('上传失败!', { type: 'error' })
        console.error('Upload failed:', response.status);
      }
    } catch (error) {
      showToast('上传失败!', { type: 'error' })
      console.error('Error:', error);
    }
    // });
  }

  const init = async () => {
    let Xmin = isUploadTimeOverTenMinutes();
    if (Xmin) {
      inputPws();
      setShow(Xmin)
    } else {
      undataTime();
      setShow(!Xmin)
    }
    getList();
  }

  useEffect(() => {
    // 获取上一次打开日期和当前时间做对比，如果大于十分钟就需要密码，否则不需要密码
    init();
    // showToast('上传成功!')
    // setTimeout(() => {
    //   showToast('上传成功!222')
    // }, 1000)
  }, []);



  const CloseButton = () => {
    return <div className="close" onClick={() => {
      SU(false);
      SB(false);
      SCF(null);
    }}>×</div>
  }
  const [selectedValue, setSelectedValue] = useState('ctime_max');


  const selectOnChange = (e) => {
    const type = e.target.value;
    if (selectedValue === type) return
    setSelectedValue(type);
    const types = type.split('_');
    if (types[0] === 'name') {
      const sortData = sortByName(data, types[1] === 'max' ? 0 : 1);
      setData(sortData);
      return
    }
    const sortData = data.sort((_, __) => types[1] === 'min' ? (_[types[0]] - __[types[0]]) : (__[types[0]] - _[types[0]]))
    setData(sortData);
  }
  return (
    <div style={{ opacity: show ? '1' : '0' }} className="videoListBlock">
      <h1>Video List</h1>
      <div className="editbox">
        <button onClick={undataFile}>刷新文件</button>
        <button onClick={updataList}>刷新列表</button>
        <div className="upload-link"
          onClick={(e) => {
            SU(true);
            SCF(null);
          }}>
          上传
        </div>
      </div>
      <div
      ><input className="seach" onChange={(e) => {
        seach(e.target.value)
      }} />
        <select className="listSortSelect" value={selectedValue} onChange={selectOnChange}>
          {options.map(_ => {
            return (<option value={_.value}>
              {_.label}
            </option>)
          })}
        </select>
      </div>
      <div>

      </div>
      <div className="video-list" ref={listRef}>

        {data.map((item, index) => {
          const date = Date.now();
          return <div className="video-item" key={`list_${index}`} onClick={() => {
            SB(true);
            SCF(item.sourceSrc);
          }}>
            <img src={item.converSrc} alt={`${item.fileName}`} onError={(e) => { if (!e.target.src.includes(`?t=${date}`)) e.target.src = `${item.converSrc}?t=${date}` }} className="videoCoverImg" />
            <p>{item.fileName}</p>

            <div className="imageTimeInfo">
              <p>文件大小：{item.size}{item.unit}</p>
              <p>m_日期：{item.mtime_f}</p>
              <p>b_日期：{item.birthtime_f}</p>
              <p>c_日期：{item.ctime_f}</p>
              <p>a_日期：{item.atime_f}</p>
            </div>
          </div>
        })}
      </div>
      <div className="uploadblock" style={{ left: uploadblockShow ? '0' : '-100%', opacity: uploadblockShow ? '1' : '0' }}>
        <CloseButton />
        <div>
          <h1>Upload File</h1>
          <form ref={formRef} onSubmit={uploadFile} action={`${ip}/upload`} method="post" encType="multipart/form-data">
            <input type="file" name="file" required className="selectFile" />
            <input type="submit" value="Upload" className="uploadSubmit" />
          </form>
        </div>
      </div>
      <div className="fileInfoBlock" style={{ left: fileInfoBlockShow ? '0' : '100%', opacity: fileInfoBlockShow ? '1' : '0' }}>
        <CloseButton />
        <VideoController videoSrc={currentFile} />
      </div>
    </div >
  );
}

export default App;
