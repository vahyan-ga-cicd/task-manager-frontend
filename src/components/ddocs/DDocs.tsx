"use client";

import { useParams } from "next/navigation";
import {
  Code,
  Server,
  Database,
  Shield,
  Package,
  LayoutDashboard,
  Users,
  CheckCircle,
  Download,
  Cloud,
  Lock,
} from "lucide-react";

type Section = "frontend" | "backend";

const sectionData: Record<
  Section,
  {
    title: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    features: string[];
    endpoints?: Array<{
      method: string;
      path: string;
      requiresAuth: boolean;
      description: string;
    }>;
    techStack: string[];
    setupCommands: string[];
  }
> = {
  frontend: {
    title: "Frontend Documentation",
    icon: <Package className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-600",
    description:
      "Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS 4.x",
    features: [
      "Next.js 16.1.6 with App Router",
      "React 19.2.3 + React Compiler",
      "TypeScript 5.x strict mode",
      "Tailwind CSS 4.x + Lightning CSS",
      "AuthContext + Axios interceptors",
      "Responsive glassmorphism design",
      "React Compiler optimizations",
    ],
    techStack: [
      "Next.js 16.1.6",
      "React 19.2.3",
      "TypeScript 5.x",
      "Tailwind CSS 4.x",
      "Axios 1.13.6",
      "Lucide React",
    ],
    setupCommands: ["npm install", "npm run dev", "http://localhost:3000"],
  },
  backend: {
    title: "Backend Documentation",
    icon: <Server className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
    description: "FastAPI serverless on AWS Lambda + DynamoDB + Redis caching",
    features: [
      "FastAPI + Mangum ASGI adapter",
      "AWS Lambda via Docker containers",
      "DynamoDB (Users + Tasks tables)",
      "Redis ElastiCache (300s TTL)",
      "JWT + bcrypt authentication",
      "Terraform IaC provisioning",
      "Redis fallback + auto-disable",
    ],
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/auth/register",
        requiresAuth: false,
        description: "Create new user",
      },
      {
        method: "POST",
        path: "/api/v1/auth/login",
        requiresAuth: false,
        description: "Authenticate user",
      },
      {
        method: "GET",
        path: "/api/v1/auth/user",
        requiresAuth: true,
        description: "Get user data",
      },
      {
        method: "POST",
        path: "/api/v1/tasks/create-task",
        requiresAuth: true,
        description: "Create task",
      },
      {
        method: "GET",
        path: "/api/v1/tasks/fetch-task",
        requiresAuth: true,
        description: "Fetch all tasks",
      },
      {
        method: "PUT",
        path: "/api/v1/tasks/update-task/{id}",
        requiresAuth: true,
        description: "Update task status",
      },
      {
        method: "DELETE",
        path: "/api/v1/tasks/delete-task/{id}",
        requiresAuth: true,
        description: "Delete task",
      },
    ],
    techStack: [
      "FastAPI",
      "AWS Lambda",
      "Docker",
      "DynamoDB",
      "Redis",
      "Terraform",
      "Mangum",
    ],
    setupCommands: [
      "pip install -r requirements.txt",
      "uvicorn app.main:app --reload",
      "terraform init && terraform apply",
    ],
  },
};

const DDocs = () => {
  const params = useParams();
  const section = params?.section as Section;

  const data = sectionData[section || "frontend"];

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Section Not Found
          </h1>
          <p className="text-xl text-slate-600">
            Valid sections: frontend, backend
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 bg-gradient-to-r ${data.color} rounded-xl shadow-lg`}
              >
                {data.icon}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {data.title}
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  {data.description}
                </p>
              </div>
            </div>
            <DocsNav currentSection={section} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tech Stack */}
        <section className="mb-16">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Database className="w-7 h-7 text-blue-600" />
              Tech Stack
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="group p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:shadow-md transition-all duration-300 border border-slate-200 hover:-translate-y-1"
                >
                  <code className="text-lg font-mono font-semibold text-slate-900 block">
                    {tech}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 lg:p-10 shadow-2xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
                Key Features
              </h3>
              <ul className="space-y-3">
                {data.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-700 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Setup */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 lg:p-10 shadow-2xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Download className="w-7 h-7 text-blue-600" />
                Quick Setup
              </h3>
              <div className="space-y-3">
                {data.setupCommands.map((cmd, idx) => (
                  <div
                    key={idx}
                    className="group bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        Step {idx + 1}
                      </span>
                      <code className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-mono">
                        {idx === 0 ? "install" : idx === 1 ? "dev" : "live"}
                      </code>
                    </div>
                    <code className="block text-slate-800 font-mono bg-white/50 px-3 py-2 rounded-lg border w-full">
                      {cmd}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* API Endpoints - Backend Only */}
        {section === "backend" && data.endpoints && (
          <section className="mb-16">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-10 shadow-2xl">
              <h3 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 mx-auto max-w-md">
                <Shield className="w-8 h-8" />
                API Endpoints Reference
              </h3>

              <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                {data.endpoints.map((endpoint, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          endpoint.requiresAuth
                            ? "bg-orange-500/20 text-orange-200 border border-orange-500/30"
                            : "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      {endpoint.requiresAuth && (
                        <Lock className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                    <code className="text-lg font-mono block mb-2 text-blue-200">
                      {endpoint.path}
                    </code>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {endpoint.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-white/20 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 max-w-2xl mx-auto">
                  <p className="text-slate-300 mb-4 text-sm">
                    <strong>Auth Header:</strong>{" "}
                    <code className="bg-white/30 px-2 py-1 rounded font-mono text-xs ml-1">
                      Authorization: Bearer {`{token}`}
                    </code>
                  </p>
                  <p className="text-slate-400 text-xs">
                    API Base:{" "}
                    <code className="bg-white/30 px-3 py-1 rounded font-mono text-xs ml-2">
                      https://6ft4bgs2e6.execute-api.ap-south-1.amazonaws.com/api/v1
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Database Schema - Backend Only */}
        {section === "backend" && (
          <section className="mb-16">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Database className="w-7 h-7 text-blue-600" />
                DynamoDB Schema
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4 text-lg">
                    Users Table
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span>Partition Key:</span>
                      <code className="font-mono">user_id (UUID)</code>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span>GSI:</span>
                      <code className="font-mono">email-index</code>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span>Attributes:</span>
                      <code className="font-mono">
                        username, email, password_hash
                      </code>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4 text-lg">
                    Tasks Table
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span>Partition Key:</span>
                      <code className="font-mono">user_id (UUID)</code>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span>Sort Key:</span>
                      <code className="font-mono">task_id (UUID)</code>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span>Attributes:</span>
                      <code className="font-mono">
                        title, description, status, created_at
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="mt-24 bg-slate-900/90 backdrop-blur-md text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-slate-400 mb-2">
            Task Manager Documentation v0.1.0
          </p>
          <p className="text-sm text-slate-500">Updated March 12, 2026</p>
        </div>
      </footer>
    </div>
  );
};

const DocsNav = ({ currentSection }: { currentSection: Section }) => (
  <nav className="flex bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-slate-200 shadow-sm">
    {(["frontend", "backend"] as Section[]).map((section) => (
      <a
        key={section}
        href={`/ddcos/${section}`}
        className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
          currentSection === section
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
        }`}
      >
        {section === "frontend" ? (
          <Package className="w-4 h-4" />
        ) : (
          <Server className="w-4 h-4" />
        )}
        {section.charAt(0).toUpperCase() + section.slice(1)}
      </a>
    ))}
  </nav>
);

export default DDocs;
