const fs = require('fs')
const path = require('path')

// const getFilePath = async () => {
//   return new Promise((resolve) => {
//     const readlineSync = require('readline-sync');
//     const fileSrc = readlineSync.question('input your path:\n')   
//     resolve(fileSrc)
//   })
// }

const validPath = (curFile, keyArr = []) => {
  let flag = true
  keyArr.forEach(item => {
    if (curFile.includes(item)) {
      flag = false
    }
  })

  return flag
}

const getFileTree = async () => {
  const rootPath = 'D:/XAEP-WEB'
  // 递归所有文件，并导出树结构
  const _fileRead = (targetPath, obj = { name: 'root', wholeName: 'root', children: null}) => {
    // 判断是文件还是目录
    const stat = fs.statSync(targetPath)
    if (stat.isDirectory() && validPath(targetPath, ['node_modules', '.git'])) {
      const fileList = fs.readdirSync(targetPath)
      obj.children = []

      fileList.forEach(item => {
        const newPath = path.join(targetPath, item)
        // 自顶向下，递归的根本代码
        obj.children.push({
          name: item,
          wholeName: newPath,
          children: _fileRead(newPath, { name: item, wholeName: newPath, children: null })
        })
      })
      if (obj.name === 'root') {
        // 如果是第一级，返回整个对象（这里需要去学习一下堆栈的概念，这里是最后出栈的）
        return obj
      } else {
        // 下一级的children，一层一层打开
        return obj.children
      }
    } else {
      // 由于是自定向下的，这里最后返回的其实是叶子的部分，叶子下面没有叶子，所以是 null
      return null
    }
  }
  
  try {
    const resJson = _fileRead(rootPath)
    fs.writeFileSync('./project-file-structure.txt', JSON.stringify(resJson), 'utf-8', err => {
      console.log('写入文件错误：', err)
    })

    return resJson
  } catch (error) {
    console.log('函数运行错误：', error)
  }
}

// 生成形如下方的结构：
// ————————————————————————————————————————————————————
// ├── dist                       // 构建打包生成部署文件
// │   ├── 1905301430                 // 静态资源（19年05月30日14时30分）
// │   ├── config                     // 配置
// │   ├── index.html                 // index.html入口
// ├── build                      // 构建相关  
// ├── config                     // 构建配置相关
const treeToStr = (jsonObj) => {
  console.log(jsonObj)
}

// 
const writeTree = () => {
  
}

(() => {
  const treeJson = getFileTree()
  console.log('test', treeJson)
})()

