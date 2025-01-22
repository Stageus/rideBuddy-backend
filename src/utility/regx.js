export const idRegx = /^[a-zA-Z]{1,20}$/; //필수값, 최대 20글자 영대소문자제한
export const pwRegx = /^[0-9a-zA-Z*\&\^\@\!]{1,20}$/; //필수값, 최대 20글자 제한, 숫자, 영대소문자, *&^@! 특수기호 포함
export const nameRegx = /^[가-힣]{1,5}$/; //필수값, 최대 5글자 한글 제한
export const mailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,30}$/; // 필수값, 최대 30글자 이메일 표현식, 메일입력시 @기준 구분없이 통으로 써서 보내주기
export const codeRegx = /^[0-9]{6}$/; //필수값, 6글자 고정, 숫자제한
