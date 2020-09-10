/**
 * title: 用于生成项目文件目录
 */
const fs = require('fs')
const path = require('path')
// 排除不想要遍历子级的节点
const validPath = (curFile, keyArr = []) => {
  let flag = true
  keyArr.forEach(item => {
    if (curFile.includes(item)) {
      flag = false
    }
  })

  return flag
}

// 获取树结构(深度遍历)
const getFileTree = () => {
  const rootPath = 'D:/XAEP-WEB'
  // const rootPath = 'D:/node-tools/for-test'
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
          children: _fileRead(newPath, { name: item, wholeName: newPath, children: null})
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
    const resObj = _fileRead(rootPath)
    const resJson = JSON.stringify(resObj)
    fs.writeFileSync('./project-file-structure.json', resJson, 'utf-8', err => {
      console.log('写入文件错误：', err)
    })

    return resObj
  } catch (error) {
    console.log('函数运行错误：', error)
  }
}

// 生成形如下方的结构：
// ————————————————————————————————————————————————————
// ├── dist                       // 构建打包生成部署文件
// │---├── 1905301430                 // 静态资源（19年05月30日14时30分）
// │   ├── config                     // 配置
// │   ├── index.html                 // index.html入口
// ├── build                      // 构建相关  
// ├── config                     // 构建配置相关
const writeTree = (rootObj, needRoot = false, levelLimit = false) => {
  let res = ''
  let stack = [rootObj]
  let count = 0

  // 广度遍历能够标记每一个子节点的层级（好处）
  const bfs = () => {
    let node = stack[count]
    if (node) {
      // 如果需要根节点，则从 1 开始；如果不需要根节点，则刚开始不需要
      node.level = node.level || (needRoot ? 1 : 0)
      // 如果限定了最大层级，则更深的层级不用往下遍历了
      if (levelLimit && node.level > levelLimit) {
        return
      }
      let str = Array.from(new Array(node.level), () => '|---').join('')
      if (node.name !== 'root' || needRoot) {
        res +=  `${str}${node.name}\n`
      }
      count++

      if (node.children) {
        stack.push(...node.children.map(item => {
          item.level = node.level + 1
          return item
        }))
      }

      bfs()
    }
  }

  
  bfs()
  fs.writeFileSync('./project-file-structure.txt', res, 'utf-8', err => {
    console.log('写入txt文件失败：', err)
  })
  return res
}

(async () => {
  const treeJson = getFileTree()
  const treeStr = writeTree(treeJson, false, 4)
  console.log('hh', treeStr)
})()

