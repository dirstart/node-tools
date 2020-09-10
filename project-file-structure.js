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
      return obj.children
    } else {
      return obj
    }
  }

  const god = _fileRead(rootPath)
  console.log('god', god)
  fs.writeFileSync('./test.txt', JSON.stringify(god), 'utf-8', err => {
    console.log('err', err)
  })
}

main()

