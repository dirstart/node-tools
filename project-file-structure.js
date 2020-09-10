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

const main = async () => {
  const rootPath = 'E:/XAEP-WEB'
  // 递归所有文件，并导出树结构
  const _fileRead = (targetPath, obj = { name: 'root', wholeName: 'root', children: null}) => {
    // 判断是文件还是目录
    const stat = fs.statSync(targetPath)
    if (stat.isDirectory() && validPath(targetPath, ['node_modules', '.git'])) {
      const fileList = fs.readdirSync(targetPath)
      obj.children = []

      fileList.forEach(item => {
        const newPath = path.join(targetPath, item)
        obj.children.push({
          name: item,
          wholeName: newPath,
          children: _fileRead(newPath, { name: item, wholeName: newPath, children: null })
        })
      })
      if (obj.name === 'root') {
        // 如果是第一级，返回整个对象
        return obj
      } else {
        return obj.children
      }
    } else {
      return obj
    }
  }
  
  try {
    const resJson = _fileRead(rootPath)
    fs.writeFileSync('./project-file-structure.txt', JSON.stringify(resJson), 'utf-8', err => {
      console.log('写入文件错误：', err)
    })
  } catch (error) {
    console.log('函数运行错误：', error)
  }
}

main()

