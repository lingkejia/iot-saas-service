import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// 设备
@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, unique: true })
  deviceId: string;

  @Column({ length: 100 })
  devId: string;

  @Column({ default: false })
  online: boolean;

  @Column({ nullable: true })
  lastOnlineAt: Date;

  @Column({ nullable: true })
  firmwareVersion: string;

  // @Column({
  //   type: 'enum',
  //   enum: ['gateway', 'device'],
  //   default: 'device',
  // })
  // type: string;

  // 最新的属性数据{"key1":{"value":123,"timestamp":1692800000000}}
  // @Column({ type: 'json', default: {} })
  // properties: Record<string, any>;
  // @OneToMany(() => DeviceProperty, (property) => property.device, {
  //   cascade: true,
  // })
  // properties: DeviceProperty[];

  // 标签{key1:value1}
  // @Column({ type: 'json', default: {} })
  // tags: Record<string, any>;
  // @OneToMany(() => DeviceTag, (tag) => tag.device, {
  //   cascade: true,
  // })
  // tags: DeviceTag[];

  // 配置
  // @OneToMany(() => DeviceConfig, (config) => config.device, {
  //   cascade: true,
  // })
  // configs: DeviceConfig[];

  @Column({ nullable: true })
  location: string;

  // 所属分组
  // @ManyToOne(() => DeviceGroup, { nullable: true })
  // @JoinColumn({ name: 'groupId' })
  // group: DeviceGroup;

  // @Column({ nullable: true })
  // groupId: string;

  // @Column({ default: false })
  // postlog: boolean;

  // 所属产品
  // @ManyToOne(() => Product, { nullable: true })
  // @JoinColumn({ name: 'productId' })
  // product: Product;

  @Column({ nullable: true })
  productId: string;

  // @Column({ nullable: true, length: 255 })
  // mqttPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
