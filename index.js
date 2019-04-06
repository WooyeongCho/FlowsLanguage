var fs = require("fs")

const functionSyntax = /.* *\(.*\)/i // 함수 문법 : 함수이름 (파라미터)

var functions = { // 기본 함수 정의
  말하기: function(param, line) {
    var paramForm = [{name: "thingToSay", essential: true}, {name: "nextLine", essential: true}] // 매개변수 양식

    if(isParamOfFunctionMatchParamForm(param, paramForm, line)) {
      //process.stdout.write(param[0])
      if(param.length == 1) {
        process.stdout.write(param[0] + "\n")
      } else {
        switch (param[1]) {
          case "참":
            process.stdout.write(param[0] + "\n")
            break;
          case "거짓":
            process.stdout.write(param[0])
            break;
        }
      }
    }
  }
}

var userFunctions = {} // 사용자가 만든 함수 // 사용자가 만든 함수에는 흐름글 코드가 들어감

var errors = { // 기본 함수 정의
  function_is_not_defined: "존재하지 않는 함수입니다.",
  param_of_function_overflow: "함수의 매개변수가 필요 이상입니다.",
  param_of_function_insufficient: "함수의 매개변수가 부족합니다."
}


var epath = "hello.flows" // 파일 패스
var epathContents = getFileContents(epath) // 파일 내용
epathContents = trimAllElements(epathContents) // 파일 내용을 모두 trim시킴

epathContents.forEach(function(line, index) { // 줄 읽기
  readLine(line, index)
})


// Function Area ////////////////////////////////////////////////////////////////

// 파일 가져오기 (줄마다 split해서 반환시킴)
function getFileContents(path) {
  var r = /\r/gi
  var comment = /\/\*.*\*\//gi
  var str = fs.readFileSync(path, 'utf8')
  return str.replace(r, "").replace(comment, "").split("\n")
}

// list의 모든 element들을 trim시킴
function trimAllElements(list) {
  var result = []
  list.forEach(function(line) {
    result.push(line.trim())
  })
  return result
}

// 흐름글 코드에서 함수의 매개변수가 그 매개변수의 양식과 맞는지 체크
// paramOfFunction은 함수의 매개변수
// paramForm은 그 함수의 매개변수 양식
function isParamOfFunctionMatchParamForm(paramOfFunction, paramForm, line) {
  var optionalFormStartPoint = 0
  var count = 0
  while (paramForm[count] == false) {
    count++
  }
  optionalFormStartPoint = count
  if (paramOfFunction.length <= paramForm.length && paramOfFunction[0] != "") { // 함수 매개변수가 조건에 만족하는 경우
    return true
  } else {
    if (paramOfFunction.length > (optionalFormStartPoint + 1)) { // 함수 매개변수가 조건보다 많은 경우
      error("param_of_function_overflow", line)
      return false
    } else {
      error("param_of_function_insufficient", line)
      return false
    }
  }

}

function error(errorCode, index) {
  console.error(`〔오류〕 ${errors[errorCode]} 〔오류가 일어난 곳: ${index + 1}번째 줄〕`)
}

// 구문(한 줄) 읽어, 무언가를 실행시킴
function readLine(line, index) {
  executeFunction(line, index)
}

// 함수 실행시킴, line 매개변수에는 오직 함수 구문만 들어감
// 예시) line 매개변수 값이 '변수 a = 입력()'는 X
// 예시) line 매개변수 값이 '입력()'는 O
function executeFunction(lineString, line) {
  if (functionSyntax.test(lineString)) { // 만약 line이 함수 문법이라면
    var functionName = lineString.replace(/ *\(.*\)/i, "") // 함수 이름을 얻기
    var functionParameters = trimAllElements(/\((.*)\)/i.exec(lineString)[1].split(",")) // 함수의 파라미터들을 얻기(list)

    functionParameters.forEach(function(param, index) {
      functionParameters[index] = paramCalc(param)
    })

    if(typeof functions[functionName] === "undefined") { // 만약 함수가 존재하지 않다면
      error("function_is_not_defined", line)
    } else { // 함수가 존재한다면

      functions[functionName](functionParameters, line)
    }
  }
}

function paramCalc(param) { // 파라미터 계산 (예: "안녕" + "세계"는 "안녕세계"로 바꾸기)

  return param.replace(/\"/gi, '')
}
