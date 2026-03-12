import Link from "next/link";
import docsData from "./constant/data.json";

const { frontend: data } = docsData;

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

export default function FrontendDocs() {
  const toc = [
    { href: "#overview", label: "Overview" },
    { href: "#tech-stack", label: "Tech Stack" },
    { href: "#project-structure", label: "Project Structure" },
    { href: "#auth-flow", label: "Authentication Flow" },
    { href: "#state-management", label: "State Management" },
    { href: "#data-models", label: "Data Models" },
    { href: "#api", label: "API Endpoints" },
    { href: "#components", label: "Components" },
    { href: "#scripts", label: "Scripts & Setup" },
    { href: "#features", label: "Features" },
    { href: "#future", label: "Future Enhancements" },
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
              {/* <div className="w-5 h-5 bg-gray-900 flex items-center justify-center">
                <span className="text-white text-xs font-mono" style={{ fontSize: "8px" }}>FE</span>
              </div> */}
              <span className="text-sm font-mono text-gray-700">Frontend Documentation</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/ddocs/ddocs-backend" className="text-xs font-mono text-gray-400 hover:text-gray-700 underline">Backend Docs →</Link>
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
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Frontend</p>
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
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                      <code className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5">{step.route}</code>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* State Management */}
          <section id="state-management" className="mb-12">
            <SectionTitle id="state-management">State Management</SectionTitle>
            <h3 className="text-sm font-medium text-gray-800 mb-3">AuthContext (Global)</h3>
            <p className="text-sm text-gray-600 mb-4">{data.stateManagement.authContext.description}</p>
            <div className="border border-gray-200 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2 text-xs font-mono text-gray-500">Name</th>
                    <th className="text-left px-4 py-2 text-xs font-mono text-gray-500">Type</th>
                    <th className="text-left px-4 py-2 text-xs font-mono text-gray-500">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stateManagement.authContext.fields.map((f, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2.5"><code className="text-xs font-mono text-blue-700">{f.name}</code></td>
                      <td className="px-4 py-2.5"><code className="text-xs font-mono text-gray-500">{f.type}</code></td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">Local Component State</h3>
            <p className="text-sm text-gray-600">{data.stateManagement.localState}</p>
          </section>

          {/* Data Models */}
          <section id="data-models" className="mb-12">
            <SectionTitle id="data-models">Data Models</SectionTitle>
            <div className="space-y-8">
              {Object.entries(data.dataModels).map(([name, model]) => (
                <div key={name}>
                  <div className="flex items-center gap-3 mb-3">
                    <code className="text-sm font-mono font-bold text-gray-900">{name}</code>
                    <span className="text-xs text-gray-500">{model.description}</span>
                  </div>
                  <div className="border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-2 text-xs font-mono text-gray-500">Field</th>
                          <th className="text-left px-4 py-2 text-xs font-mono text-gray-500">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {model.fields.map((f, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-0">
                            <td className="px-4 py-2"><code className="text-xs font-mono text-blue-700">{f.name}</code></td>
                            <td className="px-4 py-2"><code className="text-xs font-mono text-gray-500">{f.type}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* API Endpoints */}
          <section id="api" className="mb-12">
            <SectionTitle id="api">API Endpoints</SectionTitle>
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200">
              <p className="text-xs font-mono text-gray-600">
                <span className="text-gray-400">Base URL: </span>
                <a href={data.apiConfig.baseURL} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline break-all">
                  {data.apiConfig.baseURL}
                </a>
              </p>
              <p className="text-xs font-mono text-gray-500 mt-1">Authorization: {data.apiConfig.authorization}</p>
            </div>
            <div className="space-y-3">
              {data.apiConfig.endpoints.map((ep, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                  <MethodBadge method={ep.method} />
                  <code className="text-sm font-mono text-gray-800">{ep.path}</code>
                  <Badge auth={ep.auth} />
                  <span className="text-sm text-gray-500">{ep.description}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Components */}
          <section id="components" className="mb-12">
            <SectionTitle id="components">Component Reference</SectionTitle>
            <div className="space-y-4">
              {data.components.map((comp, i) => (
                <div key={i} className="border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono font-bold text-gray-900">{comp.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 border border-gray-300 text-gray-500 bg-gray-50">{comp.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{comp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Scripts */}
          <section id="scripts" className="mb-12">
            <SectionTitle id="scripts">Scripts & Setup</SectionTitle>
            <h3 className="text-sm font-medium text-gray-800 mb-3">NPM Scripts</h3>
            <div className="border border-gray-200 overflow-hidden mb-6">
              <table className="w-full">
                <tbody>
                  {data.scripts.map((s, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2.5 w-48"><code className="text-xs font-mono text-blue-700">{s.command}</code></td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{s.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <h3 className="text-sm font-medium text-gray-800 mb-3">Environment Variables</h3> */}
            {/* <div className="border border-gray-200 overflow-hidden">
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
            </div> */}
          </section>

          {/* Features */}
          <section id="features" className="mb-12">
            <SectionTitle id="features">Features</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                  <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                  <span className="text-sm text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Future Enhancements */}
          <section id="future" className="mb-12">
            <SectionTitle id="future">Future Enhancements</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.futureEnhancements.map((f, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                  <span className="w-1.5 h-1.5 border border-gray-400 rounded-full shrink-0"></span>
                  <span className="text-sm text-gray-500">{f}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Nav */}
          <div className="border-t border-gray-200 pt-6 flex justify-between">
            <Link href="/" className="text-xs font-mono text-gray-500 hover:text-gray-900 underline">← Home</Link>
            <Link href="/ddocs/ddocs-backend" className="text-xs font-mono text-gray-500 hover:text-gray-900 underline">Backend Docs →</Link>
          </div>
        </main>
      </div>
    </div>
  );
}