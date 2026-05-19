"use client";

import { Navigate } from "react-router-dom";

export default function HomePage() {
  return <Navigate to="/calculator/sip" replace />;
}
