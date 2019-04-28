// line 매개변수는 한 줄의 내용을 뜻함
// f 매개변수는 특정 부분(함수)를 뜻함
// index 매개변수는 몇 번째 줄인지를 뜻함

var flowslang_fs = require("fs")

var flowslang_commands = { // 기본 명령어
  "(할 말)을 말하기": function(f) {
    var p = twoArrayToMap(getFunctionParams(Object.keys(this)[0] /*이곳 수정해야함*/), getFunctionParams(f))
    console.log(eval(p["(할 말)"]));
  },
  "변수 (변수이름)은 (변수값)으로 정하기": function(f) {
    var p = twoArrayToMap(getFunctionParams(Object.keys(this)[1]), getFunctionParams(f))

    eval(`let ${p["(변수이름)"].replace(/\(|\)/gi, "")} = ${p["(변수값)"]}`)
  }
}

var flowslang_functions = { // 사용자가 흐름글 코드에서 직접 생성한 함수

}

readFile("hello.flows")

//flowslang_commands["(할 말)을 말하기"]('()를 말하기')
//////////////////////////////////////////

function readFile(paramPath) {
  var path = paramPath // 파일 패스
  var pathContents = getFileContents(path) // 파일 내용
  pathContents = trimAllElements(pathContents) // 파일 내용을 모두 trim시킴

  pathContents.forEach((line, index) => readLine(line, index))  // 줄 읽기
}

///////////////////////////////////////////

// 파일 가져오기 (줄마다 split해서 반환시킴)
function getFileContents(paramPath) {
  var r = /\r/gi // 필요없는 부분인 /r
  var comment = /\/\*.*\*\//gi // /r을 파일에서 모두 제거
  var str = flowslang_fs.readFileSync(paramPath, 'utf8') // utf로 읽기
  return str.replace(r, "").replace(comment, "").split("\n") // 한 줄로 분해
}

// list의 모든 element들을 trim시킴
function trimAllElements(list) {
  var result = []
  list.forEach((line) => result.push(line.trim()))
  return result
}

// 함수에서 매개변수 값 부분만 배열로 추출
function getFunctionParams(f) {
  return getRegexFromString(f, /(\([^\(\)]*\))/gi)
}

// 한 줄을 읽기
function readLine(line, index) {
  runFunction(line, index) ////////////////////////// TODO
}

// 해당 문법의 명령어(함수) 찾고 명령어(함수) 실행
function runFunction(line, index) {
  for( var key in flowslang_commands ) {
    if (key.replace(/(\([^\(\)]*\))/gi, "()").replace(/을|를|은|는|으로|로/gi, "!") == line.replace(/(\([^\(\)]*\))/gi, "()").replace(/을|를|은|는|으로|로/gi, "!")) {
      flowslang_commands[key](line)
    }
  }
}

// 문자열에서 특정 문자열을 추출해 배열로 만들기
function getRegexFromString(s, re) {
  var m
  var result = []

  do {
      m = re.exec(s)
      if (m) {
          result.push(m[1])
      }
  } while (m)

  return result
}

// 두 배열을 하나의 map 으로 만들기 예) ["A", "B"]와 ["Hello", "Bye"] --> {"A": "Hello", "B": "Bye"}
function twoArrayToMap(flowslang_fst, scd) {
  var result = {}
  flowslang_fst.forEach((element, index) => result[element] = scd[index])
  return result
}
