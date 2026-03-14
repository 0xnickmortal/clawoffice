/**
 * CreateListingPage.jsx - Create a marketplace listing with full agent customization
 */

import { useState, useEffect } from 'react'
import MarketplaceLayout from './MarketplaceLayout'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

const BUILTIN_SKILLS = [
  { id: 'web_search', label: 'Web Search', icon: '🔍' },
  { id: 'code_execution', label: 'Code Execution', icon: '💻' },
  { id: 'github', label: 'GitHub', icon: '🐙' },
  { id: 'coding-agent', label: 'Coding Agent', icon: '🤖' },
  { id: 'discord', label: 'Discord', icon: '💬' },
  { id: 'slack', label: 'Slack', icon: '📱' },
  { id: 'openai-image-gen', label: 'Image Gen (DALL-E)', icon: '🎨' },
  { id: 'canvas', label: 'Canvas', icon: '🖼️' },
  { id: 'notion', label: 'Notion', icon: '📝' },
  { id: 'trello', label: 'Trello', icon: '📋' },
  { id: 'nano-pdf', label: 'PDF Editing', icon: '📄' },
  { id: 'obsidian', label: 'Obsidian', icon: '📓' },
  { id: 'summarize', label: 'Summarize', icon: '📰' },
  { id: 'task_planning', label: 'Task Planning', icon: '📋' },
  { id: 'coordination', label: 'Coordination', icon: '🤝' },
  { id: 'scheduling', label: 'Scheduling', icon: '📅' },
  { id: 'file_operations', label: 'File Operations', icon: '📁' },
  { id: 'debugging', label: 'Debugging', icon: '🐛' },
  { id: 'git_operations', label: 'Git Operations', icon: '🔀' },
]

// Skills that require API keys
const SKILL_ENV_REQUIREMENTS = {
  'discord': ['DISCORD_BOT_TOKEN'],
  'slack': ['SLACK_BOT_TOKEN'],
  'notion': ['NOTION_API_KEY'],
  'trello': ['TRELLO_API_KEY', 'TRELLO_TOKEN'],
  'openai-image-gen': ['OPENAI_API_KEY'],
}

const inputClass = "w-full bg-white border-2 border-sv-wood/30 rounded px-3 py-2.5 text-sm text-sv-brown placeholder:text-sv-text-light/50 outline-none focus:border-sv-gold"
const labelClass = "block text-xs font-semibold text-sv-text-light mb-1.5"
const smallBtnClass = "px-2 py-1 rounded text-[10px] font-medium border transition"

const CreateListingPage = () => {
  const [type, setType] = useState('agent_offering')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [pricingModel, setPricingModel] = useState('one_time')
  const [askingPrice, setAskingPrice] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [selectedSkills, setSelectedSkills] = useState(['web_search', 'summarize'])
  const [customRole, setCustomRole] = useState('')
  const [defaultModel, setDefaultModel] = useState('anthropic')
  const [icon, setIcon] = useState('🤖')
  const [agents, setAgents] = useState([])
  const [selectedAgentId, setSelectedAgentId] = useState('')
  const [isManager, setIsManager] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [source, setSource] = useState('scratch')

  // Custom skills
  const [mcpServers, setMcpServers] = useState([])
  const [customSkillDefs, setCustomSkillDefs] = useState([]) // [{ name, skillMd, scripts: [{ filename, code }] }]
  const [apiKeys, setApiKeys] = useState({})

  const getAuthHeaders = () => {
    const token = localStorage.getItem('discord_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const ownerId = localStorage.getItem('discord_user_id') ||
          JSON.parse(localStorage.getItem('discord_user') || '{}').id
        if (!ownerId) return
        const res = await fetch(`${API_BASE_URL}/api/agents?ownerId=${ownerId}`)
        if (res.ok) {
          const data = await res.json()
          setAgents(data.agents || data || [])
        }
      } catch (err) {
        console.error('Failed to load agents:', err)
      }
    }
    fetchAgents()
  }, [])

  // Compute all required API keys from selected skills + MCP servers
  const requiredApiKeys = (() => {
    const keys = new Set()
    selectedSkills.forEach(sid => {
      const reqs = SKILL_ENV_REQUIREMENTS[sid]
      if (reqs) reqs.forEach(k => keys.add(k))
    })
    mcpServers.forEach(mcp => {
      if (mcp.envKeys) mcp.envKeys.split(',').map(k => k.trim()).filter(Boolean).forEach(k => keys.add(k))
    })
    return Array.from(keys)
  })()

  const showToast = (message, isError = false) => {
    setToast({ message, isError })
    setTimeout(() => setToast(null), 2500)
  }

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]
    )
  }

  // MCP Server helpers
  const addMcpServer = () => {
    setMcpServers(prev => [...prev, { name: '', command: '', envKeys: '' }])
  }
  const updateMcpServer = (index, field, value) => {
    setMcpServers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m))
  }
  const removeMcpServer = (index) => {
    setMcpServers(prev => prev.filter((_, i) => i !== index))
  }

  // Custom Skill helpers
  const handleSkillFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const content = ev.target.result
        // Try to extract name from frontmatter
        const nameMatch = content.match(/^---[\s\S]*?name:\s*(.+?)[\r\n]/m)
        const folderName = nameMatch ? nameMatch[1].trim() : file.name.replace(/\.(md|skill)$/i, '')
        setCustomSkillDefs(prev => [...prev, { name: folderName, skillMd: content, scripts: [] }])
      }
      reader.readAsText(file)
    })
    e.target.value = '' // reset so same file can be re-uploaded
  }
  const updateCustomSkill = (index, field, value) => {
    setCustomSkillDefs(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }
  const removeCustomSkill = (index) => {
    setCustomSkillDefs(prev => prev.filter((_, i) => i !== index))
  }
  const removeSkillScript = (skillIndex, scriptIndex) => {
    setCustomSkillDefs(prev => prev.map((s, i) => i === skillIndex
      ? { ...s, scripts: s.scripts.filter((_, j) => j !== scriptIndex) }
      : s
    ))
  }
  const handleScriptFileUpload = (skillIndex, e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setCustomSkillDefs(prev => prev.map((s, i) => i === skillIndex
          ? { ...s, scripts: [...s.scripts, { filename: `scripts/${file.name}`, code: ev.target.result }] }
          : s
        ))
      }
      reader.readAsText(file)
    })
    e.target.value = ''
  }

  const handleSubmit = async () => {
    if (!title.trim()) { showToast('Please enter a title', true); return }
    if (!askingPrice || Number(askingPrice) < 0) { showToast('Please set a valid price', true); return }
    if (type === 'agent_offering' && source === 'existing' && !selectedAgentId) {
      showToast('Please select an agent', true); return
    }

    setSubmitting(true)
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      const body = { type, title: title.trim(), description: description.trim(), tags, pricingModel, askingPrice: Number(askingPrice) }

      if (type === 'agent_offering') {
        if (source === 'existing') body.agentId = selectedAgentId
        body.systemPrompt = systemPrompt
        body.skills = selectedSkills
        body.customRole = customRole || title
        body.defaultModel = defaultModel
        body.icon = icon
        body.isManager = isManager
        // Custom skills
        body.mcpServers = mcpServers.filter(m => m.name && m.command)
        body.customSkillDefs = customSkillDefs.filter(s => s.name && s.skillMd)
        body.apiKeys = apiKeys
        body.requiredApiKeys = requiredApiKeys
      }

      const res = await fetch(`${API_BASE_URL}/api/marketplace/listings`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        showToast('Listing created!')
        setTimeout(() => { window.location.href = '/marketplace' }, 1000)
      } else {
        const err = await res.json()
        showToast(err.error || 'Failed to create listing', true)
      }
    } catch {
      showToast('Failed to create listing', true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MarketplaceLayout>
      <div className="max-w-2xl">
        <h1 className="font-[var(--font-pixel)] text-lg text-sv-brown mb-1">
          &#9670; Create Listing &#9670;
        </h1>
        <p className="text-sv-text-light text-sm mb-6">Publish an agent or post a hiring request</p>

        <div className="sv-box p-6">
          {/* Type */}
          <div className="mb-5">
            <label className={labelClass}>Listing Type</label>
            <div className="flex gap-2">
              {[
                { id: 'agent_offering', label: '🤖 Publish Agent' },
                { id: 'hiring_request', label: '📋 Hiring Request' },
              ].map(t => (
                <button
                  key={t.id}
                  className={`px-4 py-2 rounded text-xs font-medium border-2 transition-all ${
                    type === t.id
                      ? 'bg-sv-orange text-white border-sv-orange'
                      : 'bg-white text-sv-text-light border-sv-wood/20 hover:border-sv-gold/50'
                  }`}
                  onClick={() => setType(t.id)}
                >{t.label}</button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-5">
            <label className={labelClass}>Title</label>
            <input
              type="text"
              className={inputClass}
              placeholder={type === 'hiring_request' ? 'What kind of agent do you need?' : 'Name your agent offering'}
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} resize-y min-h-20`}
              placeholder={type === 'hiring_request' ? 'Describe the agent capabilities you need...' : 'Describe what your agent can do...'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Agent Offering - Custom Fields */}
          {type === 'agent_offering' && (
            <>
              {/* Source */}
              <div className="mb-5">
                <label className={labelClass}>Agent Source</label>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-2 rounded text-xs font-medium border-2 transition ${
                      source === 'scratch' ? 'bg-sv-grass text-white border-sv-grass' : 'bg-white text-sv-text-light border-sv-wood/20'
                    }`}
                    onClick={() => setSource('scratch')}
                  >Build from Scratch</button>
                  <button
                    className={`px-3 py-2 rounded text-xs font-medium border-2 transition ${
                      source === 'existing' ? 'bg-sv-grass text-white border-sv-grass' : 'bg-white text-sv-text-light border-sv-wood/20'
                    }`}
                    onClick={() => setSource('existing')}
                  >Export Existing Agent</button>
                </div>
              </div>

              {/* Select existing agent */}
              {source === 'existing' && (
                <div className="mb-5">
                  <label className={labelClass}>Select Agent</label>
                  <select className={inputClass} value={selectedAgentId} onChange={e => setSelectedAgentId(e.target.value)}>
                    <option value="" disabled>Choose an agent</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Role Name + Icon */}
              <div className="flex gap-4 mb-5">
                <div className="flex-1">
                  <label className={labelClass}>Role Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g., Quantitative Trader"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                    maxLength={50}
                  />
                </div>
                <div className="w-20">
                  <label className={labelClass}>Icon</label>
                  <input
                    type="text"
                    className={`${inputClass} text-center text-lg`}
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>

              {/* System Prompt - THE CORE */}
              <div className="mb-5">
                <label className={labelClass}>
                  System Prompt
                  <span className="text-sv-orange ml-1">(Core Instructions)</span>
                </label>
                <textarea
                  className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
                  placeholder={`Define your agent's personality, expertise, and behavior...\n\nExample:\nYou are an expert quantitative trader. You analyze market data, develop trading strategies, and backtest them using Python.\n\n1. Always use data-driven analysis\n2. Consider risk management first\n3. Explain your reasoning clearly`}
                  value={systemPrompt}
                  onChange={e => setSystemPrompt(e.target.value)}
                  rows={10}
                />
                <p className="text-[10px] text-sv-text-light/60 mt-1">
                  This is the most valuable part. Define personality, expertise, working style, and rules.
                </p>
              </div>

              {/* Skills */}
              <div className="mb-5">
                <label className={labelClass}>Built-in Skills</label>
                <div className="flex flex-wrap gap-2">
                  {BUILTIN_SKILLS.map(skill => (
                    <button
                      key={skill.id}
                      className={`px-2.5 py-1.5 rounded text-[11px] font-medium border-2 transition ${
                        selectedSkills.includes(skill.id)
                          ? 'bg-sv-gold/20 text-sv-wood border-sv-gold/40'
                          : 'bg-white text-sv-text-light/70 border-sv-wood/10 hover:border-sv-gold/30'
                      }`}
                      onClick={() => toggleSkill(skill.id)}
                    >
                      {skill.icon} {skill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ═══ MCP Servers ═══ */}
              <div className="mb-5">
                <label className={labelClass}>
                  MCP Servers
                  <span className="text-sv-text-light/50 font-normal ml-1">(External tool servers)</span>
                </label>
                {mcpServers.map((mcp, i) => (
                  <div key={i} className="bg-sv-cream/30 border border-sv-wood/15 rounded p-3 mb-2">
                    <div className="flex gap-2 mb-2">
                      <input
                        className={`${inputClass} !py-1.5 !text-xs`}
                        placeholder="Name (e.g. Trello MCP)"
                        value={mcp.name}
                        onChange={e => updateMcpServer(i, 'name', e.target.value)}
                      />
                      <button
                        className={`${smallBtnClass} border-sv-red/30 text-sv-red hover:bg-sv-red/10 shrink-0`}
                        onClick={() => removeMcpServer(i)}
                      >Remove</button>
                    </div>
                    <input
                      className={`${inputClass} !py-1.5 !text-xs font-mono mb-2`}
                      placeholder="Command (e.g. npx -y @modelcontextprotocol/server-trello)"
                      value={mcp.command}
                      onChange={e => updateMcpServer(i, 'command', e.target.value)}
                    />
                    <input
                      className={`${inputClass} !py-1.5 !text-xs`}
                      placeholder="Required env vars (comma-separated, e.g. TRELLO_API_KEY, TRELLO_TOKEN)"
                      value={mcp.envKeys}
                      onChange={e => updateMcpServer(i, 'envKeys', e.target.value)}
                    />
                  </div>
                ))}
                <button
                  className={`${smallBtnClass} border-sv-gold/40 text-sv-wood hover:bg-sv-gold/10`}
                  onClick={addMcpServer}
                >+ Add MCP Server</button>
              </div>

              {/* ═══ Custom Skills (SKILL.md) ═══ */}
              <div className="mb-5">
                <label className={labelClass}>
                  Custom Skills
                  <span className="text-sv-text-light/50 font-normal ml-1">(Upload SKILL.md files)</span>
                </label>
                {customSkillDefs.map((skill, i) => (
                  <div key={i} className="bg-sv-cream/30 border border-sv-wood/15 rounded p-3 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-sv-wood">{skill.name}</span>
                      <span className="text-[10px] text-sv-text-light/50 font-mono truncate flex-1">SKILL.md</span>
                      <button
                        className={`${smallBtnClass} border-sv-red/30 text-sv-red hover:bg-sv-red/10 shrink-0`}
                        onClick={() => removeCustomSkill(i)}
                      >Remove</button>
                    </div>
                    <details className="mb-2">
                      <summary className="text-[11px] text-sv-wood cursor-pointer hover:underline">Edit SKILL.md content</summary>
                      <textarea
                        className={`${inputClass} !py-1.5 !text-xs font-mono resize-y mt-1`}
                        value={skill.skillMd}
                        onChange={e => updateCustomSkill(i, 'skillMd', e.target.value)}
                        rows={8}
                      />
                    </details>
                    {/* Bundled script files */}
                    {skill.scripts.length > 0 && (
                      <div className="mb-1.5">
                        <p className="text-[10px] text-sv-text-light/60 mb-1">Bundled scripts:</p>
                        {skill.scripts.map((sc, j) => (
                          <div key={j} className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono text-sv-wood truncate flex-1">{sc.filename}</span>
                            <button
                              className="text-sv-red text-[10px] hover:underline shrink-0"
                              onClick={() => removeSkillScript(i, j)}
                            >x</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className={`${smallBtnClass} border-sv-wood/20 text-sv-text-light/70 hover:bg-sv-gold/10 mt-1 cursor-pointer inline-block`}>
                      + Upload Script Files
                      <input
                        type="file"
                        multiple
                        accept=".py,.sh,.js,.ts,.bash"
                        className="hidden"
                        onChange={e => handleScriptFileUpload(i, e)}
                      />
                    </label>
                  </div>
                ))}
                <label
                  className={`${smallBtnClass} border-sv-gold/40 text-sv-wood hover:bg-sv-gold/10 cursor-pointer inline-block`}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('bg-sv-gold/20') }}
                  onDragLeave={e => { e.currentTarget.classList.remove('bg-sv-gold/20') }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('bg-sv-gold/20'); handleSkillFileUpload({ target: { files: e.dataTransfer.files }, value: '' }) }}
                >
                  + Upload SKILL.md
                  <input
                    type="file"
                    multiple
                    accept=".md,.skill"
                    className="hidden"
                    onChange={handleSkillFileUpload}
                  />
                </label>
                <p className="text-[10px] text-sv-text-light/50 mt-1">
                  Upload .md files with YAML frontmatter (name + description). Drag & drop supported.
                </p>
              </div>

              {/* ═══ API Keys ═══ */}
              {requiredApiKeys.length > 0 && (
                <div className="mb-5">
                  <label className={labelClass}>
                    API Keys
                    <span className="text-sv-text-light/50 font-normal ml-1">(Optional — buyers can provide their own at deploy)</span>
                  </label>
                  <div className="space-y-2">
                    {requiredApiKeys.map(keyName => (
                      <div key={keyName} className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-sv-wood bg-sv-gold/10 px-2 py-1 rounded shrink-0 min-w-[140px]">
                          {keyName}
                        </span>
                        <input
                          type="password"
                          className={`${inputClass} !py-1.5 !text-xs`}
                          placeholder="Pre-fill (optional)"
                          value={apiKeys[keyName] || ''}
                          onChange={e => setApiKeys(prev => ({ ...prev, [keyName]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-sv-text-light/60 mt-1">
                    Pre-filled keys are bundled with the package. Buyers can override with their own keys when deploying.
                  </p>
                </div>
              )}

              {/* Manager Toggle */}
              <div className="mb-5">
                <label
                  className="flex items-center gap-2.5 cursor-pointer select-none"
                  onClick={() => setIsManager(!isManager)}
                >
                  <div className={`w-9 h-5 rounded-full border-2 transition-all relative ${
                    isManager ? 'bg-sv-orange border-sv-orange' : 'bg-white border-sv-wood/30'
                  }`}>
                    <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${
                      isManager ? 'left-[17px] bg-white' : 'left-0.5 bg-sv-wood/40'
                    }`} />
                  </div>
                  <span className="text-xs font-semibold text-sv-text-light">
                    Can delegate tasks to other agents (Manager role)
                  </span>
                </label>
                <p className="text-[10px] text-sv-text-light/60 mt-1 ml-[46px]">
                  Enable if this agent should coordinate and assign tasks to other agents.
                </p>
              </div>

              {/* Default Model */}
              <div className="mb-5">
                <label className={labelClass}>Recommended Model</label>
                <select className={inputClass} value={defaultModel} onChange={e => setDefaultModel(e.target.value)}>
                  <option value="anthropic">Claude (Anthropic)</option>
                  <option value="openai">GPT (OpenAI)</option>
                  <option value="google">Gemini (Google)</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="minimax">MiniMax (Global)</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="xai">Grok (xAI)</option>
                  <option value="mistral">Mistral</option>
                </select>
              </div>
            </>
          )}

          {/* Tags */}
          <div className="mb-5">
            <label className={labelClass}>Tags (comma-separated)</label>
            <input
              type="text"
              className={inputClass}
              placeholder="seo, marketing, coding, trading"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
            />
          </div>

          {/* Pricing */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className={labelClass}>Pricing Model</label>
              <select className={inputClass} value={pricingModel} onChange={e => setPricingModel(e.target.value)}>
                <option value="one_time">One-time Purchase</option>
                <option value="subscription">Monthly Subscription</option>
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>
                {type === 'hiring_request' ? 'Budget' : 'Price'} (credits)
              </label>
              <input
                type="number"
                className={inputClass}
                placeholder="500"
                value={askingPrice}
                onChange={e => setAskingPrice(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              className="sv-btn !text-[11px]"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Listing'}
            </button>
            <a href="/marketplace" className="text-sm text-sv-text-light hover:text-sv-orange transition">
              Cancel
            </a>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded text-white text-sm font-medium z-50 ${
          toast.isError ? 'bg-sv-red' : 'bg-sv-grass'
        }`}>
          {toast.message}
        </div>
      )}
    </MarketplaceLayout>
  )
}

export default CreateListingPage
