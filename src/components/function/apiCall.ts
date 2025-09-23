import axios from 'axios'
import { computed } from 'vue'
import { useLoginStore } from '../../stores/loginStore' // 根据实际路径调整

type ApiType = 'login' | 'regist' | 'logout' | 'post' | 'edit'
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
  noContentType?: boolean;
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
      case 'edit': return '/api/user/edit';
      default: return ''
    }
  });

  const apiMethodMap: Record<ApiType, HttpMethod> = {
    login: 'post',
    regist: 'post',
    logout: 'post',
    post: 'post',
    edit: 'put'
  }

  const loginStore = useLoginStore();

  // 构建配置对象
  const config: {
    method: HttpMethod;
    url: string;
    params?: QueryParams;
    data?: UserRequestBody | FormData | null;
    headers: Record<string, string>;
  } = {
    method: apiMethodMap[apiType] || 'post',
    url: 'http://abd77f82.natappfree.cc' + target.value,
    headers: {
      ...options?.headers,
    }
  }

  if (apiType !== 'login' && apiType !== 'regist') {
    config.headers['Authorization'] = loginStore.header;
  }

  if (query && Object.keys(query).length > 0) {
    config.params = query;
  }

  if (body !== undefined && body !== null) {
    config.data = body;
  }

  if (body !== undefined && body !== null) {
    if (isFormData(body)) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (!options?.noContentType && !config.headers['Content-Type']) {
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
      throw error;
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
