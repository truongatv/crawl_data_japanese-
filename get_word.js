const puppeteer = require("puppeteer");
const fs = require("fs");

let rawdata = fs.readFileSync('result.json');
let list_link = JSON.parse(rawdata);

(async () => {
  let list_page = []
  //sleep function
  const sleepFunction =　async function sleep(t) {
    return await new Promise(r => {
      setTimeout(() => {
        r();
      }, t);
    });
  }
  // console.log(list_page)
  // for (let link of list_link) {
  //   console.log(link)
  // }
  // const browser = await puppeteer.launch({headless: false, devtools: true});
  // const page = await browser.newPage();
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  //disable image and font
  let words = []
  let data = []
  start = 101;
  end = 150;
  for (let j = start; j <= end; j++) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // page.on('request', (req) => {
    //   if(req.resourceType() === 'image'  || req.resourceType() === 'font' || req.resourceType() === 'stylesheet'){
    //       req.abort();
    //   }
    //   else {
    //       req.continue();
    //   }
    // })
    console.log(list_link[j].link)
    // if(link.level !== 'N5') break;
    // let link= link.link 
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(list_link[j].link, {waitUntil: 'networkidle2'});
    let result = await page.evaluate(({list_link, j}) => {
      console.log(j)
        main_word = document.getElementsByClassName("main-word")[0]
        if(main_word) {
          main_word = main_word.innerHTML
          main_word = main_word.split(" ").join("")
          main_word = main_word.split("\n").join("")
        } else {
          main_word = ''
        }
        console.log(main_word)
        // debugger;

        phonetic_word = document.getElementsByClassName("phonetic-word")[0]
        if(phonetic_word) {
          phonetic_word = phonetic_word.innerHTML
          phonetic_word = phonetic_word.split(" ").join("")
          phonetic_word = phonetic_word.split("\n").join("")
        } else {
          phonetic_word = ''
        }
        console.log(phonetic_word)

        han_viet_word = document.getElementsByClassName("han-viet-word")[0]
        if(han_viet_word) {
          han_viet_word = phonetic_word.innerHTML
          han_viet_word = phonetic_word.split("\n").join("")
        } else {
          han_viet_word = ''
        }
        console.log(han_viet_word)

        mean_fr_word = document.querySelectorAll("mean-fr-word")
        // console.log(mean_fr_word)

        mean_fr_words = []
        mean_fr_word.forEach(item => {
          mean_fr_words.push(item.innerText)
        })
        type_word = document.getElementsByClassName("type-word")[0]
        if(type_word) {
          type_word = phonetic_word.innerHTML
        } else {
          type_word = ''
        }
        // console.log(type_word)

        example_word = document.querySelectorAll("ng-example > div > div > span.japanese-char ")
        example_mean_word = document.querySelectorAll(".example-mean-word")
        example_words = []
        let count = 0
        example_word.forEach(item => {
          let str = item.textContent
          str = str.split('\n').join('');
          str = Array.from(str)
          start = false
          text = ""
          for (var i = 0 ; i < str.length; i++) {
            if(str[i] == " " && str[i-1] !== " " && str[i+1] != " ") {
              str[i] = "("
              start = true;
            }
            if(str[i] == " " && str[i-1] !== " " && str[i+1] == " " && start) {
              str[i] = ")"
              start = false
            }
            if(str[i] != " ") {
              text += str[i];
            }
          }
          example_words.push({
            example_word: text,
            example_mean_word: example_mean_word[count].innerText
          })
          count++
        })
        result = {
          index: j,
          link: list_link[j].link,
          level: list_link[j].level,
          main_word: main_word,
          phonetic_word: phonetic_word,
          han_viet_word: han_viet_word,
          mean_fr_words: mean_fr_words,
          type_word: type_word,
          example_words: example_words
        }
        return result
    }, {list_link, j});
    console.log(result)
    words.push(result)
    await browser.close();
    // for(let rs of words) {
      await fs.writeFile('words_' + end + '.json', JSON.stringify(words) + "\n", function(err) {
        if (err) throw err;
      });
    // }

    await sleepFunction(15000);
  }
  // console.log(words)
  // for(let rs of words) {
  //   await fs.appendFile(`words.json`, JSON.stringify(rs) + "\n", function(err) {
  //     if (err) throw err;
  //   });
  // }
  // await browser.close();
  
})();