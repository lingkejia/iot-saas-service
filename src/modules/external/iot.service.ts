import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IotService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit() {
    // this.getDevices({});
  }

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

  async getProduct(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getProductTag(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/tags`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getProductProperty(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/properties`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getProductCommand(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/commands`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getProductEvent(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/events`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getProductConfig(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/products/${id}/configs`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getDevices(query: {
    name?: string;
    deviceId?: string;
    online?: boolean;
    productId?: string;
  }) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices`;
    const response = await this.httpService.axiosRef.get(url, {
      params: query,
    });

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getDevice(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async updateDevice(id: string, dto: any) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}`;
    const response = await this.httpService.axiosRef.patch(url, dto);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  // async getDeviceStatus(id: string) {
  //   const baseUrl = this.getBaseUrl();
  //   const url = `${baseUrl}/devices/${id}/status`;
  //   const response = await this.httpService.axiosRef.get(url);
  //   if (response.status !== HttpStatus.OK) {
  //     throw new Error(response.statusText);
  //   }
  //   return response.data;
  // }

  async getDeviceTag(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/tag`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getDeviceProperty(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/property`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

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

  async getDeviceCommands(
    id: string,
    query: {
      deviceId?: string;
      beginTime?: string;
      endTime?: string;
      limit?: number;
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

  async sendDeviceCommand(id: string, data: any) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/command`;
    const response = await this.httpService.axiosRef.post(url, data);

    if (response.status !== HttpStatus.CREATED) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getDeviceConfig(id: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/devices/${id}/config`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  async getDeviceConfigs(
    id: string,
    query: {
      deviceId?: string;
      beginTime?: string;
      endTime?: string;
      limit?: number;
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
