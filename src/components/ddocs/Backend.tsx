import Link from "next/link";
import docsData from "./constant/data.json";
const { backend: data } = docsData;

function Badge({ auth }: { auth: boolean }) {
  return (
    <span className={`text-xs font-mono px-2 py-0.5 border ${
      auth ? "border-amber-400 text-amber-700 bg-amber-50" : "border-gray-300 text-gray-500 bg-gray-50"
    }`}>
      {auth ? "AUTH" : "PUBLIC"}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "text-green-700 bg-green-50 border-green-300",
    POST: "text-blue-700 bg-blue-50 border-blue-300",
    PUT: "text-orange-700 bg-orange-50 border-orange-300",
    DELETE: "text-red-700 bg-red-50 border-red-300",
  };
  return (
    <span className={`text-xs font-mono px-2 py-0.5 border font-bold ${colors[method] ?? "text-gray-700 bg-gray-50 border-gray-300"}`}>
      {method}
    </span>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3 mb-6 scroll-mt-8">
      {children}
    </h2>
  );
}

export default function BackendDocs() {
  const toc = [
    { href: "#overview", label: "Overview" },
    { href: "#tech-stack", label: "Tech Stack" },
    { href: "#project-structure", label: "Project Structure" },
    { href: "#database", label: "Database Schema" },
    { href: "#auth-flow", label: "Authentication Flow" },
    { href: "#caching", label: "Caching Strategy" },
    { href: "#endpoints", label: "API Endpoints" },
    { href: "#local-setup", label: "Local Setup" },
    { href: "#env", label: "Environment Variables" },
    { href: "#deployment", label: "Deployment" },
    { href: "#infrastructure", label: "Infrastructure" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-4 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-mono text-gray-400 hover:text-gray-700 underline">← Home</Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2">
              {/* <div className="w-5 h-5 border border-gray-900 flex items-center justify-center">
                <span className="text-gray-900 text-xs font-mono" style={{ fontSize: "8px" }}>BE</span>
              </div> */}
              <span className="text-sm font-mono text-gray-700">Backend Documentation</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/ddocs/ddocs-frontend" className="text-xs font-mono text-gray-400 hover:text-gray-700 underline">← Frontend Docs</Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-10 flex gap-12">
        {/* Sidebar TOC */}
        {/* <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-20">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">Contents</p>
            <nav className="space-y-1">
              {toc.map((item) => (
                <a key={item.href} href={item.href}
                  className="block text-xs text-gray-500 hover:text-gray-900 font-mono py-0.5 hover:underline">
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-mono text-gray-400">v{data.version}</p>
              <p className="text-xs font-mono text-gray-400">{data.lastUpdated}</p>
            </div>
          </div>
        </aside> */}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Title */}
          <div className="mb-10">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Backend</p>
            <h1 className="text-4xl font-light text-gray-900 mb-3" style={{ fontFamily: "Georgia, serif" }}>
              {data.subtitle}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed max-w-2xl">{data.overview}</p>
          </div>

          {/* Overview */}
          <section id="overview" className="mb-12">
            <SectionTitle id="overview">Overview</SectionTitle>
            <p className="text-sm text-gray-600 leading-relaxed">{data.overview}</p>
          </section>

          {/* Tech Stack */}
          <section id="tech-stack" className="mb-12">
            <SectionTitle id="tech-stack">Tech Stack</SectionTitle>
            <div className="border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2 text-xs font-mono text-gray-500 uppercase">Category</th>
                    <th className="text-left px-4 py-2 text-xs font-mono text-gray-500 uppercase">Technology</th>
                  </tr>
                </thead>
                <tbody>
                  {data.techStack.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2.5 text-xs font-mono text-gray-500">{item.category}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-800">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Project Structure */}
          <section id="project-structure" className="mb-12">
            <SectionTitle id="project-structure">Project Structure</SectionTitle>
            <p className="text-xs font-mono text-gray-400 mb-4">Root: <code className="bg-gray-100 px-1 py-0.5">{data.projectStructure.root}</code></p>
            <div className="space-y-2">
              {data.projectStructure.directories.map((dir, i) => (
                <div key={i} className="flex gap-4 py-2.5 border-b border-gray-100 last:border-0">
                  <code className="text-xs font-mono text-blue-700 w-52 shrink-0">{dir.path}</code>
                  <p className="text-sm text-gray-600">{dir.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Database Schema */}
          <section id="database" className="mb-12">
            <SectionTitle id="database">Database Schema (DynamoDB)</SectionTitle>
            <div className="space-y-6">
              {data.databaseSchema.map((table, i) => (
                <div key={i} className="border border-gray-200 p-5">
                  <h3 className="text-sm font-mono font-bold text-gray-900 mb-4">{table.table}</h3>
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <span className="text-xs font-mono text-gray-400 w-32 shrink-0">Partition Key</span>
                      <code className="text-xs font-mono text-blue-700">{table.partitionKey}</code>
                    </div>
                    {table.sortKey && (
                      <div className="flex gap-4">
                        <span className="text-xs font-mono text-gray-400 w-32 shrink-0">Sort Key</span>
                        <code className="text-xs font-mono text-blue-700">{table.sortKey}</code>
                      </div>
                    )}
                    {table.gsi && (
                      <div className="flex gap-4">
                        <span className="text-xs font-mono text-gray-400 w-32 shrink-0">GSI</span>
                        <code className="text-xs font-mono text-purple-700">{table.gsi}</code>
                      </div>
                    )}
                    <div className="flex gap-4 pt-2 border-t border-gray-100">
                      <span className="text-xs font-mono text-gray-400 w-32 shrink-0">Attributes</span>
                      <div className="flex flex-wrap gap-1">
                        {table.attributes.map((attr, j) => (
                          <code key={j} className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 text-gray-700">{attr}</code>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Auth Flow */}
          <section id="auth-flow" className="mb-12">
            <SectionTitle id="auth-flow">Authentication Flow</SectionTitle>
            <div className="space-y-4">
              {data.authFlow.map((step) => (
                <div key={step.step} className="flex gap-4 items-start">
                  <div className="w-7 h-7 border border-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-mono font-bold text-gray-900">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Caching Strategy */}
          <section id="caching" className="mb-12">
            <SectionTitle id="caching">Caching Strategy (Redis)</SectionTitle>
            <div className="border border-gray-200 p-5 space-y-3">
              {[
                { label: "Cache Key", value: data.cachingStrategy.key },
                { label: "TTL", value: data.cachingStrategy.ttl },
                { label: "Used For", value: data.cachingStrategy.usedFor },
                { label: "Invalidation", value: data.cachingStrategy.invalidation },
                { label: "Fallback", value: data.cachingStrategy.fallback },
              ].map((row, i) => (
                <div key={i} className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-xs font-mono text-gray-400 w-28 shrink-0">{row.label}</span>
                  <span className="text-sm text-gray-700">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* API Endpoints */}
          <section id="endpoints" className="mb-12">
            <SectionTitle id="endpoints">API Endpoints</SectionTitle>
            <div className="space-y-10">
              {data.endpoints.map((group, gi) => (
                <div key={gi}>
                  <h3 className="text-sm font-mono font-bold text-gray-700 mb-4 uppercase tracking-widest">{group.group}</h3>
                  <div className="space-y-4">
                    {group.routes.map((route, ri) => (
                      <div key={ri} className="border border-gray-200 p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <MethodBadge method={route.method} />
                          <code className="text-sm font-mono text-gray-900">{route.path}</code>
                          <Badge auth={route.auth} />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{route.description}</p>
                        {route.payload && (
                          <div className="bg-gray-50 border border-gray-200 p-3">
                            <p className="text-xs font-mono text-gray-400 mb-1.5">Request Body</p>
                            <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                              {JSON.stringify(route.payload, null, 2)}
                            </pre>
                          </div>
                        )}
                        {route.response && (
                          <p className="text-xs font-mono text-gray-500 mt-2">Response: {route.response}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Local Setup */}
          <section id="local-setup" className="mb-12">
            <SectionTitle id="local-setup">Local Setup</SectionTitle>
            <div className="space-y-4">
              {data.localSetup.map((step) => (
                <div key={step.step} className="flex gap-4 items-start">
                  <div className="w-7 h-7 border border-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-mono font-bold text-gray-900">{step.step}</span>
                  </div>
                  <div>
                    <code className="text-xs font-mono text-blue-700 block mb-1 break-all">{step.command}</code>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Environment Variables */}
          <section id="env" className="mb-12">
            <SectionTitle id="env">Environment Variables</SectionTitle>
            <div className="border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2 text-xs font-mono text-gray-500">Variable</th>
                    <th className="text-left px-4 py-2 text-xs font-mono text-gray-500">Description</th>
                    <th className="text-left px-4 py-2 text-xs font-mono text-gray-500">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {data.envVariables.map((v, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2.5"><code className="text-xs font-mono text-blue-700">{v.name}</code></td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{v.description}</td>
                      <td className="px-4 py-2.5"><code className="text-xs font-mono text-gray-400">{v.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Deployment */}
          <section id="deployment" className="mb-12">
            <SectionTitle id="deployment">Deployment</SectionTitle>
            <div className="space-y-4">
              {data.deployment.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-7 h-7 border border-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-mono font-bold text-gray-900">{step.step}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pt-1">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Infrastructure */}
          <section id="infrastructure" className="mb-12">
            <SectionTitle id="infrastructure">Infrastructure (Terraform-provisioned)</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.infrastructure.map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                  <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Nav */}
          <div className="border-t border-gray-200 pt-6 flex justify-between">
            <Link href="/ddocs/ddocs-frontend" className="text-xs font-mono text-gray-500 hover:text-gray-900 underline">← Frontend Docs</Link>
            <Link href="/" className="text-xs font-mono text-gray-500 hover:text-gray-900 underline">Home →</Link>
          </div>
        </main>
      </div>
    </div>
  );
}