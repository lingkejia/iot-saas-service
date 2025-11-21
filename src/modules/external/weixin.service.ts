import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeixinService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getOpenId(code: string) {
    const appid = this.configService.get('weixin.appid');
    const appsecret = this.configService.get('weixin.secret');
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`;
    const response = await this.httpService.axiosRef.get(url);

    if (response.status !== HttpStatus.OK) {
      throw new Error(response.statusText);
    }

    if (response.data.errcode) {
      throw new Error(response.data.errmsg);
    }

    return response.data.openid;
  }
}
