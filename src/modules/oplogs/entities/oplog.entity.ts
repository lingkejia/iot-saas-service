import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'oplogs', comment: '操作日志' })
export class Oplog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '标题', length: 50 })
  title: string;

  @Column({ comment: '类型(@OplogType)' })
  type: number;

  @Column({ comment: 'url', length: 200 })
  url: string;

  @Column({ comment: 'ip', nullable: true, length: 50 })
  ip: string;

  // @Column({ comment: 'IP位置', nullable: true, length: 500 })
  // location: string;

  @Column({ comment: '用户代理', nullable: true, length: 500 })
  userAgent: string;

  @Column({ comment: '开始时间' })
  beginTime: Date;

  @Column({ comment: '处理时长' })
  duration: number;

  @Column({ comment: '状态' })
  status: number;

  @Column({ comment: '状态描述', nullable: true, length: 500 })
  message: string;

  @Column({ comment: '异常堆栈', nullable: true, type: 'text' })
  stack: string;

  @Column({ nullable: true, comment: '用户名', length: 50 })
  username: string;

  @Column({ comment: '请求参数', nullable: true, type: 'text' })
  requestParam: string;

  @Column({ comment: '响应结果', nullable: true, type: 'text' })
  responseResult: string;

  @CreateDateColumn()
  createdAt: Date;
}
