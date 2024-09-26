import http from 'http'
import fs from 'fs'
import escape from 'escape-html'
import * as htmlparser2 from 'htmlparser2'

//let req;
let res;

const exclude = ['id', 'type', 'fieldName']
let AllWords = []

let SingleFileWords = []

const parser = new htmlparser2.Parser({
  ontext(text) {
    if (text && text.trim().length > 0) {
      //do as you need, you can concatenate or collect as string array
      SingleFileWords.push(...text.split(' '))
    }
  }
});

function getWords (item) {
  Object.keys(item).forEach((key) => {
    if (!exclude.includes(key)) {
      if (typeof item[key] == 'object' && item[key] !== null) {
        getWords(item[key])
      } else {
        const line = item[key]
        if(line) {
          parser.write(line)
        }
      }
    }
  })
}

function PrintFileInfo (filePath, words, showWords) {
  res.write('\n')
  res.write('File-> ' + escape(filePath))
  res.write('\n')
  res.write('Words-> ' + escape(words.length))
  if(showWords === true){
    res.write('\n' + words.join(','))
  }
  res.write('\n')
}

function readFiles (dir) {
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = files[i]
    var filePath = dir + '/' + name;
    if (fs.statSync(filePath).isDirectory()) {
      readFiles(filePath);
    } else {
      // read file here...
      if (name.endsWith('.json')) {

        SingleFileWords=[]
        const jsonContent = JSON.parse(fs.readFileSync(filePath))
        jsonContent.forEach((item) => {
          getWords(item)
        })
        //ReadFile()
        PrintFileInfo(filePath, SingleFileWords)
        //store in global
        AllWords.push(...SingleFileWords)
      }
    }
  }
}

const server = http.createServer((request, response) => {
  // clear globals
  AllWords=[]
  SingleFileWords=[]

  // set globally
  //req = request
  res = response

  // Text to the body
  res.write('WORDS SUMMARY FOR TENANT FOLDER' + '\n' + '\n' + 'Notes -> This application is not 100% accurate, it try to count strings but fail to identify the HTML text.' + '\n'+ '\n'+ '\n')

  readFiles('./tenants')

  res.write('\n' + '\n' + 'All Words Found -> ' + AllWords.length + '\n' + '\n')
  const UniqueSet = Array.from(new Set(AllWords))
  res.write('All Unique Words Found -> ' + UniqueSet.length+ '\n' + '\n')
  UniqueSet.forEach((word,i)=>{
    res.write((i + 1) + '. ' + escape(word) + '\n')
  })

  // Telling server that all header and body response has been sent
  res.end()
})

// Defining port for the server to run
server.listen(3000, () => {
  console.log('Server running on port 3000');
});