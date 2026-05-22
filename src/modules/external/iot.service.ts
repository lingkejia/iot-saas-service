import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';

@Injectable()
export class IotService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  // 获取基础URL
  private getBaseUrl() {
    const url = this.configService.get('IOT_API');
    const key = this.configService.get('IOT_API_KEY');
    const secret = this.configService.get('IOT_API_SECRET');

    this.httpService.axiosRef.defaults.headers.common['X-API-KEY'] = key;
    this.httpService.axiosRef.defaults.headers.common['X-API-SECRET'] = secret;
    this.httpService.axiosRef.defaults.headers.common['Content-Type'] =
      'application/json';

    return url;
  }

  // 获取产品详情
  async getProduct(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取产品标签
  async getProductTag(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/tags`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取产品属性
  async getProductProperty(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/properties`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取产品命令
  async getProductCommand(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/commands`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取产品事件
  async getProductEvent(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/events`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取产品配置
  async getProductConfig(id: string, identifier: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/configs`;
    const response = await this.httpService.axiosRef.get(url, {
      params: {
        identifier,
      },
    });

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取设备列表
  async getDevices(query: any) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices`;
    const response = await this.httpService.axiosRef.get(url, {
      params: query,
      // 特殊配置：使数组ids[1,2,3]变成ids=1&ids=2&ids=3
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取设备详情
  async getDevice(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 更新设备
  async updateDevice(id: string, dto: any) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}`;
    const response = await this.httpService.axiosRef.patch(url, dto);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取设备标签
  async getDeviceTag(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/tag`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取设备属性
  async getDeviceProperty(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/property`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取设备属性历史
  async getDeviceProperties(
    id: string,
    query: {
      deviceId?: string;
      property?: string;
      beginTime?: string;
      endTime?: string;
      limit?: number;
    },
  ) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/properties`;
    const response = await this.httpService.axiosRef.get(url, {
      params: query,
    });

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取设备事件历史
  async getDeviceEvents(
    id: string,
    query: {
      deviceId?: string;
      beginTime?: string;
      endTime?: string;
      limit?: number;
    },
  ) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/events`;
    const response = await this.httpService.axiosRef.get(url, {
      params: query,
    });

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取设备命令记录
  async getDeviceCommands(
    id: string,
    query: {
      deviceId?: string;
      beginTime?: string;
      endTime?: string;
      page?: number;
      pageSize?: number;
    },
  ) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/commands`;
    const response = await this.httpService.axiosRef.get(url, {
      params: query,
    });

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 发送设备命令
  async sendDeviceCommand(id: string, data: any) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/command`;
    const response = await this.httpService.axiosRef.post(url, data);

    if (response.status !== HttpStatus.CREATED) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取设备配置
  async getDeviceConfig(id: string, identifier: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/config`;
    const response = await this.httpService.axiosRef.get(url, {
      params: { identifier },
    });

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 获取设备配置记录
  async getDeviceConfigs(
    id: string,
    query: {
      deviceId?: string;
      beginTime?: string;
      endTime?: string;
      page?: number;
      pageSize?: number;
    },
  ) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/configs`;
    const response = await this.httpService.axiosRef.get(url, {
      params: query,
    });

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // 发送设备配置
  async sendDeviceConfig(id: string, data: any) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/config`;
    const response = await this.httpService.axiosRef.post(url, data);

    if (response.status !== HttpStatus.CREATED) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // async getAlarms(query?: {
  //   deviceId?: string;
  //   level?: 'info' | 'warning' | 'error' | 'critical';
  //   status?: 'active' | 'acknowledged' | 'resolved';
  //   startTime?: string;
  //   endTime?: string;
  // }) {
  //   const baseUrl = this.getBaseUrl();
  //   const url = `${baseUrl}/alarms`;
  //   const response = await this.httpService.axiosRef.get(url, {
  //     params: query,
  //   });
  //   if (response.status !== HttpStatus.OK) {
  //     throw new Error(response.statusText);
  //   }
  //   return response.data;
  // }

  // async getAlarmById(id: string) {
  //   const baseUrl = this.getBaseUrl();
  //   const url = `${baseUrl}/alarms/${id}`;
  //   const response = await this.httpService.axiosRef.get(url);
  //   if (response.status !== HttpStatus.OK) {
  //     throw new Error(response.statusText);
  //   }
  //   return response.data;
  // }
}
