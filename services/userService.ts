import apiClient from "./api";

// Định nghĩa types
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface CreateUserData {
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
}

// Service class cho User operations
class UserService {
  // Lấy danh sách users
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get("/users");
    return response.data;
  }

  // Lấy user theo ID
  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  // Tạo user mới
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post("/users", userData);
    return response.data;
  }

  // Cập nhật user
  async updateUser(
    id: number,
    userData: Partial<CreateUserData>
  ): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  }

  // Xóa user
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  // Tìm kiếm users
  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get(
      `/users?q=${encodeURIComponent(query)}`
    );
    return response.data;
  }
}

// Export instance singleton
export const userService = new UserService();
export default userService;
