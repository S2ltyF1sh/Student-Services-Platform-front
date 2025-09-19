import axios from 'axios';
import { computed } from 'vue';

type ApiType = 'login' | 'regist' | 'logout';

interface UserRequestBody {
  userName?: string;
  accountName?: string;
  password?: string;
  type?: number;
  email?: string;
}

interface QueryParams {
  user_id?: number | string;
}

export const apiCall = (
  apiType: ApiType,
  body?: UserRequestBody,
  query?: QueryParams
) => {
  const target = computed(() => {
    switch(apiType) {
      case 'login': return '/api/user/login';
      case 'regist': return '/api/user/reg';
      case 'logout': return '/api/user/logout';
      default: return ''
    }
  });

  let method: 'get' | 'post' = 'post';
  method = 'post';


  const config = {
    method,
    url: 'http://e7f876fc.natappfree.cc'+target.value,
    data: body,
    params: query
  };

  // 发送请求
  return axios(config)
    .then(response => {
      console.log(`${apiType}响应:`, response);
      if (response.data.code === 200 || response.data.code === 0) {
        return response.data;
      } else {
        throw new Error(response.data.msg || `${apiType}请求失败`);
      }
    })
    .catch(error => {
      console.error(`${apiType}错误:`, error);
      throw error;
    });
};
