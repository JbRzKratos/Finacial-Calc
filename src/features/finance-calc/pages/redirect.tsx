"use client";

import { Navigate } from "react-router-dom";

export default function RedirectPage() {
  return <Navigate to="/calculator/sip" replace />;
}
