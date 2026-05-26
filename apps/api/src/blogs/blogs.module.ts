import { Module } from '@nestjs/common';

import { AdminBlogCategoriesController } from './admin-blog-categories.controller';
import { AdminBlogsController } from './admin-blogs.controller';
import { BlogCategoriesService } from './blog-categories.service';
import { BlogsService } from './blogs.service';

@Module({
  controllers: [AdminBlogsController, AdminBlogCategoriesController],
  providers: [BlogsService, BlogCategoriesService],
  exports: [BlogsService, BlogCategoriesService],
})
export class BlogsModule {}
