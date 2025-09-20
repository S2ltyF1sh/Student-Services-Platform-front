import axios from 'axios'
import { computed } from 'vue'

type ApiType = 'login' | 'regist' | 'logout' | 'post'
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

interface UserRequestBody {
  userName?: string;
  accountName?: string;
  password?: string;
  type?: number;
  email?: string;
  image?: File | Blob | string;
}

interface QueryParams {
  user_id?: number | string;
}

interface ApiCallOptions {
  headers?: Record<string, string>;
}

const isFormData = (data: unknown): data is FormData => {
  return data instanceof FormData;
}

export const apiCall = (
  apiType: ApiType,
  body?: UserRequestBody | FormData,
  query?: QueryParams,
  options?: ApiCallOptions
) => {
  const target = computed(() => {
    switch(apiType) {
      case 'login': return '/api/user/login';
      case 'regist': return '/api/user/reg';
      case 'logout': return '/api/user/logout';
      case 'post': return '/api/student/post';
      default: return ''
    }
  });

const apiMethodMap: Record<ApiType, HttpMethod> = {
  login: 'post',
  regist: 'post',
  logout: 'post',
  post: 'post'
}

  const config = {
    method: apiMethodMap[apiType] || 'post',
    url: ' http://k8acdf29.natappfree.cc' + target.value,
    params: query,
    data: body,
    headers: {
      ...options?.headers,
    } as Record<string, string>
  }

  if (body) {
    if (isFormData(body)) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

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
      throw error
    })
}

          // const selectedFile = ref<File | null>(null);



          // <span class="lableInput"><p>图片上传：</p><input type="file" @change="handleFileSelect" accept="image/*"></span>



          // const handleFileSelect = (event: Event) => {
          //   if (!(event.target instanceof HTMLInputElement)) {
          //     return;
          //   }

          //   if (!event.target.files || event.target.files.length === 0) {
          //     return;
          //   }

          //   selectedFile.value = event.target.files[0];
          // };



          // const formData = new FormData();

          // formData.append('accountName', "1");
          // formData.append('password', "12345678");
          // formData.append('title', "1");
          // formData.append('postType', "1");
          // formData.append('isArgent', "true");
          // formData.append('isAnonymity', "false");
          // formData.append('isArgent', "55");

          // if (selectedFile.value) {
          //   formData.append('image', selectedFile.value);
          // } else {
          //   try {
          //     const response = await fetch('/src/components/img/b_194d524861bc60ea62da2963ffc88d58.jpg');
          //     const blob = await response.blob();
          //     formData.append('image', blob, 'b_194d524861bc60ea62da2963ffc88d58.jpg');
          //   } catch (error) {
          //     console.error('无法加载图片:', error);
          //   }
          // }
