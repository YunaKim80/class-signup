// 온라인 수업 신청 시스템 - React 기반 (프론트엔드 + 백엔드 연결 + 관리자 페이지 포함)

import React, { useState, useEffect } from "react";
import "./index.css";

// ✅ 수업 정보 (샘플 데이터)
const classData = [
  {
    id: 1,
    region: "광명",
    place: "광명 YMCA",
    date: "2025-07-20",
    time: "10:00",
    capacity: 14,
  },
  {
    id: 2,
    region: "안산",
    place: "JTS안산다문화센터",
    date: "2025-07-12",
    time: "14:00",
    capacity: 14,
  },
  {
    id: 3,
    region: "김포",
    place: "사람과 평화",
    date: "2025-07-12",
    time: "14:00",
    capacity: 6,
  },
];

// ✅ 신청 내역 저장용 (Firebase 등 백엔드 연동 가정)
const mockSubmissionDatabase = {}; // { classId: [{ name, phone }] }

function ClassSignupForm() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [availableClasses, setAvailableClasses] = useState([]);
  const [adminView, setAdminView] = useState(false);

  useEffect(() => {
    setAvailableClasses(classData);
  }, []);

  const getCurrentEnrollment = (classId) => {
    return mockSubmissionDatabase[classId]?.length || 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedClass = classData.find((c) => c.id === parseInt(selectedClassId));
    const enrolled = getCurrentEnrollment(selectedClass.id);
    const isFull = enrolled >= selectedClass.capacity;

    if (!mockSubmissionDatabase[selectedClass.id]) {
      mockSubmissionDatabase[selectedClass.id] = [];
    }
    mockSubmissionDatabase[selectedClass.id].push({ name, phone });

    setMessage(
      isFull
        ? `정원이 초과되어 대기접수로 신청되었습니다. (${enrolled + 1}번째)`
        : `신청이 완료되었습니다! (${enrolled + 1}/${selectedClass.capacity})`
    );
    setName("");
    setPhone("");
    setSelectedClassId("");
  };

  if (adminView) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">📋 관리자 페이지</h2>
        {classData.map((cls) => (
          <div key={cls.id} className="mb-6 border p-3 rounded shadow-sm">
            <h3 className="font-semibold mb-2">
              [{cls.region}] {cls.place} / {cls.date} / {cls.time}
            </h3>
            <p>정원: {cls.capacity}명</p>
            <p>신청자 수: {getCurrentEnrollment(cls.id)}명</p>
            <ul className="mt-2 list-disc list-inside text-sm">
              {(mockSubmissionDatabase[cls.id] || []).map((p, idx) => (
                <li key={idx}>{p.name} ({p.phone})</li>
              ))}
            </ul>
          </div>
        ))}
        <button
          onClick={() => setAdminView(false)}
          className="w-full bg-gray-500 text-white py-2 rounded mt-4"
        >
          사용자 신청 화면으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">온라인 수업 신청</h1>
        <button
          onClick={() => setAdminView(true)}
          className="text-sm text-blue-600 underline"
        >
          관리자 보기
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">수업 선택</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full border p-2 rounded text-sm"
            required
          >
            <option value="">-- 수업을 선택하세요 --</option>
            {availableClasses.map((cls) => {
              const currentCount = getCurrentEnrollment(cls.id);
              const isFull = currentCount >= cls.capacity;
              return (
                <option key={cls.id} value={cls.id}>
                  [{cls.region}] {cls.place} / {cls.date} / {cls.time} (
                  {isFull ? "마감 - 대기접수" : `잔여 ${cls.capacity - currentCount}명`})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block font-medium">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">연락처</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          신청하기
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-gray-100 border rounded text-center text-sm">{message}</div>
      )}
    </div>
  );
}

export default ClassSignupForm;