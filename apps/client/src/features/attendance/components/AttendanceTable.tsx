// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { attendanceService } from "@/services/attendance.service";
// import { attendanceSessionService } from "@/services/attendance-session.service";
// import { studentService } from "@/services/student.service";
// import {
//   useCreateAttendanceRecord,
//   //   useUpdateAttendanceRecord,
// } from "../hooks/useAttendanceMutations";
// import { Select, LoadingScreen } from "@/components/ui";
// import { ErrorMessage } from "@/components/feedback";
// // import { useState } from "react";
// import type { AttendanceRecord, AttendanceStatus } from "@/types/entities";

// export default function AttendanceTable() {
//   const { id: sessionId } = useParams<{ id: string }>();
//   const { data: session, isLoading: loadingSession } = useQuery({
//     queryKey: ["attendance-sessions", sessionId],
//     queryFn: () => attendanceSessionService.getById(sessionId!),
//     enabled: !!sessionId,
//   });
//   const {
//     data: records,
//     isLoading: loadingRecords,
//     refetch,
//   } = useQuery({
//     queryKey: ["attendance-records", sessionId],
//     queryFn: () => attendanceService.getBySession(sessionId!),
//     enabled: !!sessionId,
//   });
//   const { data: studentsData } = useQuery({
//     queryKey: ["students", "class", session?.data?.schoolClassId],
//     queryFn: () => studentService.getByClass(session!.data.schoolClassId),
//     enabled: !!session?.data?.schoolClassId,
//   });

//   const createRecord = useCreateAttendanceRecord();
//   // For simplicity, we'll use inline update

//   if (loadingSession || loadingRecords) return <LoadingScreen />;
//   if (!session?.data) return <ErrorMessage title="Sesi tidak ditemukan" />;

//   const students = studentsData?.data || [];
//   const existingRecords = records?.data || [];

//   const getRecord = (studentId: string): AttendanceRecord | undefined =>
//     existingRecords.find((r) => r.studentId === studentId);

//   const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
//     const existing = getRecord(studentId);
//     if (existing) {
//       // Update existing record
//       attendanceService.update(existing.id, { status });
//       refetch();
//     } else {
//       // Create new record
//       createRecord.mutate({ attendanceSessionId: sessionId!, studentId, status });
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">{session.data.title}</h1>
//         <p className="text-sm text-gray-500">
//           {session.data.schoolClass?.name} |
//           {new Date(session.data.date).toLocaleDateString("id-ID")} | Guru:
//           {session.data.teacher?.name}
//         </p>
//       </div>
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Nama Siswa
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {students.map((student) => {
//               const record = getRecord(student.id);
//               return (
//                 <tr key={student.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {student.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <Select
//                       options={[
//                         { value: "PRESENT", label: "Hadir" },
//                         { value: "ABSENT", label: "Tidak Hadir" },
//                         { value: "LATE", label: "Terlambat" },
//                         { value: "EXCUSED", label: "Izin" },
//                       ]}
//                       value={record?.status || ""}
//                       onChange={(e) =>
//                         handleStatusChange(student.id, e.target.value as AttendanceStatus)
//                       }
//                       className="w-40"
//                     />
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
