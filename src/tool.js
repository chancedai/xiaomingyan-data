import path from 'path';
import fs from 'fs';
// 从 tags.json 文件中读取标签数组
import tagsArray from '../tags.json' assert { type: "json" };
import natural from 'natural';
import stopword from 'stopword';
import nodejieba from 'nodejieba';
import kmeans from 'node-kmeans';
import pkg1 from 'natural';
const { WordTokenizer } = pkg1;
import pkg from 'word2vec';
const { loadModel } = pkg;


(async function(){
  // ./data/文件夹下 有一系列文件，命名规则是这样的 tag-data-1-1.json tag-data-1-2.json ... tag-data-1-10.json,tag-data-2-1.json tag-data-2-2.json ... tag-data-2-10.json 一直到 tag-data-5-10.json
  // 每个文件里面的数据格式类似：
  // {
  //   "Qf82-HFYDC8CAlBNJABG0": {
  //     "pageNum": 459,
  //     "number": 9180,
  //     "text": {
  //       "tags": [
  //         "感动",
  //         "文学",
  //         "诗歌"
  //       ],
  //       "likes": 127,
  //       "bookmarks": 42
  //     }
  //   }
  // }
  // 现在要把所有的标签都提取出来，放到一个数组里面，然后去重，然后按照字母顺序排序，然后把这个数组写到一个文件里面，文件名为 tags.json

  // const tags = [];
  // for (let i = 1; i <= 5; i++) {
  //   for (let j = 1; j <= 10; j++) {
  //     const fileName = `tag-data-${i}-${j}.json`;
  //     const filePath = path.join('./data', fileName);
  //     const file = fs.readFileSync(filePath, 'utf-8');
  //     const obj = JSON.parse(file);
  //     const tag = Object.values(obj).map(item => item.text.tags).flat();
  //     tags.push(...tag);
  //   }
  // }
  // const tagsSet = new Set(tags);
  // const tagsArr = Array.from(tagsSet);
  // tagsArr.sort();
  // const tagsStr = JSON.stringify(tagsArr, null, 2);
  // fs.writeFileSync('./tags.json', tagsStr);
  // 

  
  
  const k = 50;

// 匹配所有非英文字符的正则表达式
const nonEnglishRegex = /[^\u4e00-\u9fa5]+/g;

// 过滤掉所有包含英文字符的标签
const tagsArray1 = tagsArray.filter(tag => tag &&!tag.match(/[a-zA-Z]/));

let segmentedTags = tagsArray1.flatMap(tag => {
  // return nodejieba.cut(tag)
  try{
    return nodejieba.cut(tag)
  }catch(e){
    console.log(e,tag)
    return ''
    
  }
});
// 删除 segmentedTags 中 undefined null '' 等无效值
segmentedTags = segmentedTags.filter(tag => {
  return tag !== undefined && tag !== null && tag !== '';
});

// / 加载预训练模型并得到向量表示
const tokenizer = new WordTokenizer();
const sentences = segmentedTags.map(tag => tokenizer.tokenize(tag));

loadModel('/Users/chance/Downloads/ppmi.literature.bigram-char',function(err,model){
  console.log(err,model,'加载了？')
  const vectors = sentences.map(sentence => sentence.map(word => model.getVector(word)));
})
// .then(model => {
//   const vectors = sentences.map(sentence => sentence.map(word => model.getVector(word)));
//   // 对向量进行聚类等后续操作
// })
// .catch(err => {
//   console.error(err);
// });

})()