import axios from 'axios'
export async function getAccessToken (key:string, secret:string) {
  let ret = await axios.get(`https://oapi.dingtalk.com/gettoken?appkey=${key}&appsecret=${secret}`)
  return ret.data.access_token
}

// cee444175b393b5f8218ddaf640e4c1e

export async function getUserFromDepart (token:string, departId:string) {
  let ret = await axios.get(`https://oapi.dingtalk.com/user/simplelist?access_token=${token}&department_id=${departId}`)
  return ret.data.userlist
}
