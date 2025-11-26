import { Injectable } from '@nestjs/common';
import { IotService } from '../external/iot.service';

@Injectable()
export class ProductService {
  constructor(private readonly iotService: IotService) {}

  async findOne(productId: string) {
    const response = await this.iotService.getProduct(productId);
    return response.data;
  }

  async findTags(productId: string) {
    const response = await this.iotService.getProductTag(productId);
    return response.data;
  }

  async findProperties(productId: string) {
    const response = await this.iotService.getProductProperty(productId);
    return response.data;
  }

  async findEvents(productId: string) {
    const response = await this.iotService.getProductEvent(productId);
    return response.data;
  }

  async findCommands(productId: string) {
    const response = await this.iotService.getProductCommand(productId);
    return response.data;
  }

  async findConfigs(productId: string, identifier: string) {
    const response = await this.iotService.getProductConfig(
      productId,
      identifier,
    );
    return response.data;
  }
}
