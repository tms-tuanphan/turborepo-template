import { Module } from '@nestjs/common';

import { AdminBlogsController } from './admin-blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  controllers: [AdminBlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
