import useSWR from "swr";
import userService, { User, CreateUserData } from "@/services/userService";

// Hook để lấy danh sách users
export function useUsers() {
  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = useSWR<User[]>("/users", () => userService.getUsers(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Cache trong 5 giây
  });

  return {
    users: users || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy user theo ID
export function useUser(id: number | null) {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<User | null>(
    id ? `/users/${id}` : null,
    id ? () => userService.getUserById(id) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // Cache trong 10 giây
    }
  );

  return {
    user,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook cho các operations (create, update, delete)
export function useUserOperations() {
  const { refresh: refreshUsers } = useUsers();

  const createUser = async (userData: CreateUserData) => {
    try {
      const newUser = await userService.createUser(userData);
      // Refresh danh sách users sau khi tạo thành công
      refreshUsers();
      return { data: newUser, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateUser = async (id: number, userData: Partial<CreateUserData>) => {
    try {
      const updatedUser = await userService.updateUser(id, userData);
      // Refresh data sau khi update
      refreshUsers();
      return { data: updatedUser, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await userService.deleteUser(id);
      // Refresh danh sách sau khi xóa
      refreshUsers();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
  };
}

// Hook tìm kiếm users
export function useUserSearch(query: string) {
  const {
    data: users,
    error,
    isLoading,
  } = useSWR<User[]>(
    query ? `/users/search/${query}` : null,
    () => (query ? userService.searchUsers(query) : Promise.resolve([])),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  return {
    users: users || [],
    isLoading,
    isError: !!error,
    error,
  };
}
