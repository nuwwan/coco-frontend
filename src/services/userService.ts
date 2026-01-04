/**
 * User Service
 * Handles auth user search and related API calls
 * 
 * Note: All endpoints use trailing slashes for Django compatibility
 */

import type { User } from '../utils/types';
import api, { type ApiResponse } from './api';

// ============================================
// Types & Interfaces
// ============================================

export interface UserSearchResponse {
  users: User[];
  total: number;
}

// ============================================
// User Service
// ============================================

class UserService {
  private basePath = '/master-data';

  /**
   * Ensures URL has trailing slash for Django compatibility
   */
  private withSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
  }

  /**
   * Search auth users by name, username, or email
   * @param searchString - Search query string
   */
  async search(searchString: string): Promise<ApiResponse<UserSearchResponse>> {
    return api.get<UserSearchResponse>(this.withSlash(`${this.basePath}/search_auth_users`), {
      params: { search: searchString },
    });
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
