import { BadRequestException } from '@nestjs/common';
import { describe, it, expect } from '@jest/globals';

import {
  buildPaginatedListResult,
  parsePaginationQuery,
  resolvePaginationSlice,
} from './parse-pagination';

describe('parsePaginationQuery', () => {
  it('should apply defaults when page and pageSize are omitted', () => {
    // Arrange & Act
    const result = parsePaginationQuery({});

    // Assert
    expect(result).toEqual({ page: 1, pageSize: 10 });
  });

  it('should apply module-specific default pageSize', () => {
    // Arrange & Act
    const result = parsePaginationQuery({}, { defaultPageSize: 9 });

    // Assert
    expect(result.pageSize).toBe(9);
  });

  it('should throw BadRequestException when pageSize exceeds max', () => {
    // Arrange & Act & Assert
    expect(() => parsePaginationQuery({ pageSize: 51 })).toThrow(
      BadRequestException,
    );
  });
});

describe('resolvePaginationSlice', () => {
  it('should clamp currentPage to totalPages', () => {
    // Arrange
    const pagination = { page: 5, pageSize: 9 };

    // Act
    const slice = resolvePaginationSlice(pagination, 10);

    // Assert
    expect(slice.totalPages).toBe(2);
    expect(slice.currentPage).toBe(2);
    expect(slice.skip).toBe(9);
    expect(slice.take).toBe(9);
  });
});

describe('buildPaginatedListResult', () => {
  it('should return items with pagination meta', () => {
    // Arrange
    const slice = resolvePaginationSlice({ page: 1, pageSize: 9 }, 1);

    // Act
    const result = buildPaginatedListResult(['a'], slice, 1);

    // Assert
    expect(result).toEqual({
      items: ['a'],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
    });
  });
});
