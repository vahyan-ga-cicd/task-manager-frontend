// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getUser } from "@/utils/api/auth";

// interface UserData {
//   data: {
//     task_data: {
//       completed_tasks: number;
//       ongoing_tasks:number;
//       pending_tasks: number;
//       tasks_count: number;
//     };
//     user_data: {
//       id: string;
//       username: string;
//       email: string;
//     };
//   };
// }

// export function useAuth() {
//   const router = useRouter();

//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [authenticated, setAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = useCallback(async () => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setAuthenticated(false);
//         return;
//       }

//       const res = await getUser();

//       setUserData(res);
//       setAuthenticated(true);
//     } catch {
//       setAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setAuthenticated(false);
//     router.replace("/login");
//   };

//   return {
//     userData,
//     authenticated,
//     loading,
//     logout,
//     fetchUser,
//   };
// }
