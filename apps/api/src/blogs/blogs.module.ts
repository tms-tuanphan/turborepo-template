import { Module } from '@nestjs/common';

import { AdminBlogCategoriesController } from './controllers/admin-blog-categories.controller';
import { AdminBlogsController } from './controllers/admin-blogs.controller';
import { BlogCategoriesService } from './services/blog-categories.service';
import { BlogsService } from './services/blogs.service';

@Module({
  controllers: [AdminBlogsController, AdminBlogCategoriesController],
  providers: [BlogsService, BlogCategoriesService],
  exports: [BlogsService, BlogCategoriesService],
})
export class BlogsModule {}
